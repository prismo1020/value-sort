/**
 * The value deck. 62 values, each with a short definition and a theme.
 * Themes are used only for the breakdown on the results screen.
 *
 * Trimmed from an original 86 by merging near-synonyms. Cards that force a
 * genuine choice are kept; cards that were the same idea worded twice are not.
 * The `merged` note on an entry records what it absorbed.
 */
export const VALUES = Object.freeze([
  // ---------------------------------------------------------------- Self
  { name: "Self-Acceptance", description: "Embracing who you are, flaws included", category: "Self", merged: ["Acceptance"] },
  { name: "Self-Esteem", description: "Having confidence in your own worth", category: "Self" },
  { name: "Self-Knowledge", description: "Understanding your own nature and motivations", category: "Self" },
  { name: "Self-Control", description: "Managing your impulses and emotions", category: "Self" },
  { name: "Authenticity", description: "Being true to yourself and living by your own beliefs", category: "Self", merged: ["Genuineness", "Alignment"] },
  { name: "Inner Peace", description: "Cultivating serenity and calm within", category: "Self" },
  { name: "Mindfulness", description: "Being present and aware in each moment", category: "Self" },
  { name: "Solitude", description: "Enjoying time alone for reflection", category: "Self" },
  { name: "Forgiveness", description: "Letting go of resentment and grudges", category: "Self" },
  { name: "Hope", description: "Maintaining optimism about the future", category: "Self" },

  // -------------------------------------------------------------- Growth
  { name: "Adventure", description: "Seeking new experiences and taking chances", category: "Growth", merged: ["Risk", "Excitement"] },
  { name: "Openness", description: "Welcoming new ideas, experiences, and change", category: "Growth", merged: ["Change"] },
  { name: "Challenge", description: "Taking on difficult tasks that push your limits", category: "Growth" },
  { name: "Growth", description: "Continuously developing and improving", category: "Growth" },
  { name: "Knowledge", description: "Pursuing understanding and learning", category: "Growth" },

  // ---------------------------------------------------------------- Work
  { name: "Accuracy", description: "Being precise and getting the details right", category: "Work" },
  { name: "Hard Work", description: "Working hard and being productive", category: "Work", merged: ["Industry"] },

  // ---------------------------------------------------------- Leadership
  { name: "Power", description: "Having authority and control over outcomes", category: "Leadership", merged: ["Authority"] },
  { name: "Decisiveness", description: "Making clear choices with confidence", category: "Leadership" },
  { name: "Empowerment", description: "Enabling and supporting others to succeed", category: "Leadership", merged: ["Nurturance"] },

  // ------------------------------------------------------------- Success
  { name: "Achievement", description: "Accomplishing meaningful goals", category: "Success" },
  { name: "Mastery", description: "Achieving excellence in a skill or domain", category: "Success" },
  { name: "Recognition", description: "Being known and well regarded by others", category: "Success", merged: ["Fame", "Popularity"] },
  { name: "Wealth", description: "Accumulating financial resources and assets", category: "Success" },

  // ------------------------------------------------------------- Freedom
  { name: "Independence", description: "Being self-directed and self-sufficient", category: "Freedom", merged: ["Autonomy"] },
  { name: "Non-Conformity", description: "Following your own path regardless of norms", category: "Freedom" },

  // ---------------------------------------------------------- Creativity
  { name: "Creativity", description: "Expressing original ideas and creating new solutions", category: "Creativity", merged: ["Innovation"] },
  { name: "Beauty", description: "Appreciating and creating aesthetic experiences", category: "Creativity" },

  // ------------------------------------------------------- Relationships
  { name: "Love", description: "Giving and receiving deep affection", category: "Relationships", merged: ["Loving", "Loved"] },
  { name: "Compassion", description: "Feeling empathy and concern for others' wellbeing", category: "Relationships", merged: ["Caring"] },
  { name: "Intimacy", description: "Building deep, close connections", category: "Relationships" },
  { name: "Family", description: "Prioritizing bonds with family members", category: "Relationships" },
  { name: "Friendship", description: "Building meaningful connections with friends", category: "Relationships" },
  { name: "Cooperation", description: "Working together with others toward shared goals", category: "Relationships", merged: ["Togetherness"] },
  { name: "Tolerance", description: "Accepting differences in others", category: "Relationships" },

  // ----------------------------------------------------------- Lifestyle
  { name: "Fun", description: "Enjoying playfulness, humor, and lightheartedness", category: "Lifestyle", merged: ["Humor"] },
  { name: "Leisure", description: "Having time for rest, comfort, and recreation", category: "Lifestyle", merged: ["Comfort"] },
  { name: "Pleasure", description: "Enjoying life's sensory experiences", category: "Lifestyle" },
  { name: "Security", description: "Feeling safe, settled, and protected from upheaval", category: "Lifestyle", merged: ["Safety", "Stability"] },
  { name: "Order", description: "Having organization and structure in life", category: "Lifestyle" },
  { name: "Simplicity", description: "Living with less complexity and clutter", category: "Lifestyle" },
  { name: "Celebration", description: "Marking achievements and special moments", category: "Lifestyle" },

  // ----------------------------------------------------------- Character
  { name: "Honesty", description: "Being truthful and transparent", category: "Character" },
  { name: "Integrity", description: "Living according to your moral principles", category: "Character", merged: ["Virtue"] },
  { name: "Responsibility", description: "Being accountable for your actions and obligations", category: "Character", merged: ["Duty", "Ownership"] },
  { name: "Dependability", description: "Being someone others can rely on", category: "Character" },
  { name: "Loyalty", description: "Staying true to your promises and your people", category: "Character", merged: ["Commitment", "Faithfulness"] },
  { name: "Generosity", description: "Giving freely of your time, resources, and comfort", category: "Character", merged: ["Sacrifice"] },
  { name: "Humility", description: "Being modest and open to learning", category: "Character" },
  { name: "Courtesy", description: "Treating others with politeness and respect", category: "Character" },
  { name: "Flexibility", description: "Adapting easily to changing circumstances", category: "Character" },
  { name: "Moderation", description: "Practicing balance and avoiding extremes", category: "Character" },
  { name: "Rationality", description: "Making decisions based on logic and a clear view of things", category: "Character", merged: ["Realism"] },

  // -------------------------------------------------------------- Health
  { name: "Health", description: "Maintaining physical and mental wellbeing", category: "Health", merged: ["Fitness"] },

  // ------------------------------------------------------------- Purpose
  { name: "Purpose", description: "Having a meaningful direction in life", category: "Purpose" },
  { name: "Service", description: "Helping others and making a positive difference", category: "Purpose", merged: ["Helpfulness", "Contribution"] },
  { name: "Justice", description: "Standing for fairness and equality", category: "Purpose" },
  { name: "Spirituality", description: "Connecting with something greater than yourself", category: "Purpose" },
  { name: "Passion", description: "Pursuing what ignites your enthusiasm", category: "Purpose" },
  { name: "Ecology", description: "Caring for the environment and sustainability", category: "Purpose" },
  { name: "Tradition", description: "Honoring customs and heritage", category: "Purpose" },
  { name: "World Peace", description: "Working toward global harmony", category: "Purpose" },
].map(Object.freeze));

export const CATEGORIES = Object.freeze([
  "Character", "Creativity", "Freedom", "Growth", "Health", "Leadership",
  "Lifestyle", "Purpose", "Relationships", "Self", "Success", "Work",
]);

/** name -> value, for rehydrating saved sessions that store names only. */
export const BY_NAME = Object.freeze(
  Object.fromEntries(VALUES.map((v) => [v.name, v]))
);
