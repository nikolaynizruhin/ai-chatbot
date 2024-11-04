import { convertToCoreMessages, Message, streamText } from 'ai';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { customModel } from '@/lib/ai';
import { Model, models } from '@/lib/ai/model';
import { deleteChatById, getActivities, getAmenities, getChatById, getPlans, getVenues, saveChat } from '@/lib/db/queries';
import { convertToEnum, convertToId, convertToMap } from '@/lib/utils';

export async function POST(request: Request) {
  const {
    id,
    messages,
    model,
  }: { id: string; messages: Array<Message>; model: Model['name'] } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!models.find((m) => m.name === model)) {
    return new Response('Model not found', { status: 404 });
  }

  const [activities, amenities, plans] = await Promise.all([
    getActivities(),
    getAmenities(),
    getPlans(),
  ]);

  const activity = convertToEnum(activities);
  const activityMap = convertToMap(activities);

  const amenity = convertToEnum(amenities);
  const amenityMap = convertToMap(amenities);

  const plan = convertToEnum(plans);
  const planMap = convertToMap(plans);

  const coreMessages = convertToCoreMessages(messages);

  const result = await streamText({
    model: customModel(model),
    system: `\n
      - you help users search venues!
      - keep your responses limited to a sentence.
      - DO NOT output lists.
      - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
      - today's date is ${new Date().toLocaleDateString()}.
      - ask follow up questions to nudge user into the optimal flow
      - ask for any details you don't know, like activity of venue, etc.'
      - here's the optimal flow
        - search for venues
      '
    `,
    messages: coreMessages,
    maxSteps: 5,
    tools: {
      getWeather: {
        description: 'Get the current weather at a location',
        parameters: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },
      searchVenues: {
        description: "Search for venues based on the given parameters",
        parameters: z.object({
          activities: z.enum(activity).array().describe("Activities that can be practiced on site"),
          amenities: z.enum(amenity).array().describe("Amenities available on site"),
          plans: z.enum(plan).array().describe("Membership plans allowed on site"),
        }),
        execute: async ({ activities, amenities, plans }) => {
          activities = convertToId(activities, activityMap);
          amenities = convertToId(amenities, amenityMap);
          plans = convertToId(plans, planMap)

          const result = await getVenues(activities, amenities, plans);

          return result;
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error('Failed to save chat');
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
