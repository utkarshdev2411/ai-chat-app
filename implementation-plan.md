# AI Storytelling App Implementation Plan

## Overview
This document outlines the changes needed to transform our current chat application into an interactive storytelling app similar to AI Dungeon with a RimWorld-inspired theme. The app will focus on generating and continuing narratives where the user leads a colony on an alien planet.

## Key Features to Implement

### 1. Story Themes/Scenarios
- Replace "avatar" with "scenario/theme" selection
- Initial scenarios: Space Colony, Post-Apocalyptic, Fantasy Kingdom, etc.
- Each scenario has a predefined starting prompt

### 2. Model Changes

#### Session Model Updates
- Add `title` field for the adventure/story name
- Add `scenario` field to track which scenario template was used
- Add `character` object with name and role
- Keep the existing message history structure

### 3. Backend Changes

#### Create Scenario Templates
- Create a collection of scenario templates with initial prompts
- Example: Space Colony, Zombie Apocalypse, Medieval Fantasy, etc.

#### Gemini API Integration
- Modify the prompt format to be storytelling-focused
- Include context about being a storyteller and maintaining narrative consistency
- Use more creative temperature settings

#### Session Controller Updates
- Add method to start a new story with a selected scenario
- Modify message handling to support both:
  - "Continue" option (AI continues the narrative)
  - "Custom action" option (User provides specific input)

### 4. Frontend Changes

#### Story Creation Flow
- Replace preference selection with scenario selection
- Add character name input
- Add optional backstory customization

#### Story UI
- Replace chat bubbles with narrative text blocks
- Distinguish between narrator (AI) text and player actions
- Add "Continue Story" button
- Add text input for custom actions

#### Visual Design
- Theme the UI to match the selected scenario
- Add ambient background images
- Add thematic icons and illustrations

## Implementation Priority

1. Update models and backend controllers
2. Create scenario templates and prompt engineering
3. Update the frontend UI for storytelling
4. Implement the dual interaction modes (continue vs. custom actions)
5. Add visual theming

## Technical Adjustments

### Prompt Engineering
For Gemini API:
- Include instructions to act as a storyteller
- Specify the genre and tone based on the scenario
- Maintain story continuity with past interactions
- Respond to user actions in a narrative style

### Session Flow
1. User selects a scenario
2. System generates initial story prompt
3. User can:
   - Click "Continue" to let AI advance the story
   - Enter custom action to influence the story direction
4. AI responds with narrative continuation
5. Repeat steps 3-4

## UI Wireframe Concepts

### Main Story Interface
```
+------------------------------------------+
|  [Story Title]           [Settings] [☰]  |
+------------------------------------------+
|                                          |
|  As you step out of your shelter, the    |
|  alien sun casts an eerie purple glow    |
|  across the landscape. Your colonists    |
|  look to you for guidance...             |
|                                          |
|  [...]                                   |
|                                          |
+------------------------------------------+
|  [Continue Story]                        |
|                                          |
|  What do you do? _________________ [➤]   |
+------------------------------------------+
```

## Next Steps
Begin implementation by updating the Session model and creating the scenario templates, then modify the frontend components to support the new storytelling format.

