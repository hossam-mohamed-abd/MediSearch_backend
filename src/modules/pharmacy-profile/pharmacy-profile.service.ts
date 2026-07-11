import { PharmacyProfileRepository } from "./pharmacy-profile.repository";

export class PharmacyProfileService {
  private repository =
    new PharmacyProfileRepository();

  async getProfile(userId: bigint) {
    const staff =
      await this.repository.findByUserId(userId);

    if (!staff) {
      throw new Error("You are not assigned to any pharmacy.");
    }

    if (!staff.pharmacies) {
      throw new Error("Pharmacy not found.");
    }

    return {
      id: Number(staff.pharmacies.id),

      name: staff.pharmacies.name,

      logo_url: staff.pharmacies.logo_url,

      phone: staff.pharmacies.phone,

      email: staff.pharmacies.email,

      address: staff.pharmacies.address,

      city: staff.pharmacies.cities
        ? {
            id: Number(staff.pharmacies.cities.id),
            name: staff.pharmacies.cities.name,
          }
        : null,

      staffRole: staff.role,

      employee: staff.users
        ? {
            id: Number(staff.users.id),

            first_name: staff.users.first_name,

            last_name: staff.users.last_name,

            email: staff.users.email,
          }
        : null,
    };
  }

  async updateProfile(
    userId: bigint,
    body: {
      phone?: string;
      address?: string;
      logo_url?: string;
    },
  ) {
    const staff =
      await this.repository.findByUserId(userId);

    if (!staff) {
      throw new Error("You are not assigned to any pharmacy.");
    }

    if (!staff.pharmacies) {
      throw new Error("Pharmacy not found.");
    }

    await this.repository.updateProfile(
      staff.pharmacies.id,
      {
        phone: body.phone,

        address: body.address,

        logo_url: body.logo_url,
      },
    );

    return this.getProfile(userId);
  }
}