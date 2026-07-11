import bcrypt from "bcryptjs";

import pharmacyAuthRepository from "./pharmacy-auth.repository";

import { PharmacyLoginDto } from "./pharmacy-auth.types";

import { generateToken } from "../../utils/generateToken";

class PharmacyAuthService {
  async login(data: PharmacyLoginDto) {
    const user = await pharmacyAuthRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const passwordCorrect = await bcrypt.compare(
      data.password,
      user.password_hash ?? "",
    );

    if (!passwordCorrect) {
      throw new Error("Invalid email or password.");
    }

    if (!user.pharmacy_staff.length) {
      throw new Error("No pharmacy assigned to this account.");
    }

    const staff = user.pharmacy_staff[0];

    if (!staff.pharmacies) {
      throw new Error("Pharmacy not found.");
    }

    await pharmacyAuthRepository.updateLastLogin(user.id);

    const token = generateToken({
      userId: user.id,
      pharmacyId: staff.pharmacy_id,
      role: "pharmacy",
      staffRole: staff.role ?? "staff",
    });

    return {
      token,

      user: {
        id: user.id,

        first_name: user.first_name,

        last_name: user.last_name,

        email: user.email,

        phone: user.phone,

        profile_image: user.profile_image,

        role: "pharmacy",

        pharmacy: {
          id: staff.pharmacies.id,

          name: staff.pharmacies.name,

          logo_url: staff.pharmacies.logo_url,

          phone: staff.pharmacies.phone,

          email: staff.pharmacies.email,

          address: staff.pharmacies.address,

          city: staff.pharmacies.cities?.name,

          staffRole: staff.role,
        },
      },
    };
  }

  async profile(userId: bigint) {
    const user = await pharmacyAuthRepository.findProfile(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.pharmacy_staff.length) {
      throw new Error("No pharmacy assigned.");
    }

    const staff = user.pharmacy_staff[0];

    return {
      id: user.id,

      first_name: user.first_name,

      last_name: user.last_name,

      email: user.email,

      phone: user.phone,

      profile_image: user.profile_image,

      role: "pharmacy",

      pharmacy: {
        id: staff.pharmacies?.id,

        name: staff.pharmacies?.name,

        logo_url: staff.pharmacies?.logo_url,

        phone: staff.pharmacies?.phone,

        email: staff.pharmacies?.email,

        address: staff.pharmacies?.address,

        city: staff.pharmacies?.cities?.name,

        governorate:
          staff.pharmacies?.cities?.governorates?.name,

        staffRole: staff.role,
      },
    };
  }
}

export default new PharmacyAuthService();