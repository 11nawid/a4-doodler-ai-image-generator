
'use server';
/**
 * @fileOverview An AI image generation agent.
 *
 * - restoreImage - A function that handles the image generation process.
 * - RestoreImageInput - The input type for the restoreImage function.
 * - RestoreImageOutput - The return type for the restoreImage function.
 */

import {z} from 'zod';

const RestoreImageInputSchema = z.object({
  prompt: z.string().describe('The user prompt for the image generation.'),
});

export type RestoreImageInput = z.infer<typeof RestoreImageInputSchema>;

const RestoreImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});

export type RestoreImageOutput = z.infer<typeof RestoreImageOutputSchema>;

export async function restoreImage(
  input: RestoreImageInput
): Promise<RestoreImageOutput> {
  const encodedPrompt = encodeURIComponent(input.prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
  
  // We add a random query param to bypass browser cache for the same prompt.
  const finalUrl = `${imageUrl}?t=${Date.now()}`;
  
  return Promise.resolve({ imageUrl: finalUrl });
}
