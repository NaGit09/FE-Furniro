import axios from "axios";

const BASE_URL = "https://provinces.open-api.vn/api/";

export const ProvinceApi = {
  getProvinces: async () => {
    const res = await axios(`${BASE_URL}p/`);

    return res.data;
  },

  getDistricts: async (provinceCode: number) => {
    const res = await axios(
      `${BASE_URL}p/${provinceCode}?depth=2`,
    );

    return res.data.districts;
  },

  getWards: async (districtCode: number) => {
    const res = await axios(
      `${BASE_URL}d/${districtCode}?depth=2`,
    );

    return res.data.wards;
  },
};