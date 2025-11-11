# DietFriend API Reference

## Authentication
Authentication will be introduced in a later iteration. All routes are currently open for rapid
prototype testing.

## Profiles
### `POST /api/v1/profiles/`
Create a new profile. Payload matches `ProfileCreate` schema.

### `GET /api/v1/profiles/`
Retrieve a list of existing profiles (demo data until persistence is added).

## Recommendations
### `POST /api/v1/recommendations/meal-plan`
Generate a personalized meal plan given a profile ID, target date, and number of meals per day.

### `GET /api/v1/recommendations/sample`
Return a sample meal plan illustrating the API contract.

## Recipes
### `GET /api/v1/recipes/regional`
Fetch recipes tailored to a region. Accepts a `region` query parameter.
