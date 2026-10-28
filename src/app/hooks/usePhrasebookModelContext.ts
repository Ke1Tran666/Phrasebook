import { db } from '@/db';
import { useEffect } from 'react';

type ModelContextDocument = Document & {
  modelContext?: {
    registerTool: (tool: unknown, options: unknown) => unknown;
  };
};

export const usePhrasebookModelContext = () => {
  useEffect(() => {
    const context = (document as ModelContextDocument).modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: 'list_phrasebook_lessons',
            description:
              'Read the lessons stored in this browser without changing them.',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true, untrustedContentHint: true },
            execute: async (input: unknown) => {
              if (
                !input ||
                typeof input !== 'object' ||
                Object.keys(input).length
              ) {
                throw Error('Expected an empty object.');
              }
              return { lessons: await db.lessons.toArray() };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      // The host integration is optional; the app still works without it.
    }

    return () => lifecycle.abort();
  }, []);
};
