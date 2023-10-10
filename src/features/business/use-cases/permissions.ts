import { AppUser } from "@features/auth/entities/app-user";
import { IRestaurantRepository } from "../ports/restaurant.repository.definition";
import { ApplicationError, ErrorCode } from "@common/errors";

export async function checkAppUserIsOwnerOfRestaurant(
  appUser: AppUser,
  restaurantRepo: IRestaurantRepository,
  restaurantId: string
) {
  const restaurant = await restaurantRepo.getOneBy({
    searchBy: { id: restaurantId },
  });

  if (!restaurant) {
    throw new ApplicationError("restaurant not found", ErrorCode.NOT_FOUND);
  }

  if (restaurant.appUserId !== appUser.id) {
    throw new ApplicationError(
      "you are not allowed to update this restaurant",
      ErrorCode.FORBIDDEN
    );
  }

  return restaurant;
}
