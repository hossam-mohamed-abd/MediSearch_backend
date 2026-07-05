import prisma from "../../config/prisma";

export interface ResolvedUserArea {
  cityName: string;
  governorateName: string | null;
  countryName: string | null;
}

export class UserLocationService {
  /**
   * Walks users -> cities -> governorates -> countries to build a
   * human-readable area string usable for geocoding (e.g. "Alexandria, Alexandria Governorate, Egypt").
   */
  async resolveUserArea(userId: bigint): Promise<ResolvedUserArea | null> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        cities: {
          select: {
            name: true,
            governorates: {
              select: {
                name: true,
                countries: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user?.cities?.name) {
      return null;
    }

    return {
      cityName: user.cities.name,
      governorateName: user.cities.governorates?.name ?? null,
      countryName: user.cities.governorates?.countries?.name ?? null,
    };
  }

  areaToQueryString(area: ResolvedUserArea): string {
    return [area.cityName, area.governorateName, area.countryName]
      .filter(Boolean)
      .join(", ");
  }
}
