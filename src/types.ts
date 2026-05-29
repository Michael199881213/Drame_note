/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Drama {
  id: string;
  title: string;
  totalEpisodes: number;
  currentEpisode: number;
  updatedAt: string; // ISO string for sorting
  imageUrl?: string; // Optional image URL or search recommendation
  note?: string; // Optional user note (e.g. "逢週日更新", "好好看！")
}
