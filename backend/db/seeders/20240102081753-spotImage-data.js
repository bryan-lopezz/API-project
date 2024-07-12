"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

options.tableName = "SpotImages";

/** @type {import('sequelize-cli').Migration} */

const spotImages = [
  {
    spotId: 1,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720677306/Ascent_46_jvuyzx.png",
    preview: true,
  },
  {
    spotId: 1,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720677309/Ascent_48_w9oypc.png",
    preview: true,
  },
  {
    spotId: 1,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720677305/Ascent_49_kcorkk.png",
    preview: true,
  },
  {
    spotId: 1,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720677308/Ascent_47_cnjvxb.png",
    preview: true,
  },
  {
    spotId: 1,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720677309/Ascent_50_ohycl7.png",
    preview: true,
  },
  {
    spotId: 2,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720595831/Ascent_1_vlxsso.png",
    preview: true,
  },
  {
    spotId: 2,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720596174/Ascent_2_t3bjrm.png",
    preview: true,
  },
  {
    spotId: 2,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720596177/Ascent_5_l4rlds.png",
    preview: true,
  },
  {
    spotId: 2,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720596177/Ascent_3_n4cesu.png",
    preview: true,
  },
  {
    spotId: 2,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720596177/Ascent_4_qwmi9a.png",
    preview: true,
  },
  {
    spotId: 3,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720678012/Ascent_20_daufht.png",
    preview: true,
  },
  {
    spotId: 3,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720678013/Ascent_24_tbyawg.png",
    preview: true,
  },
  {
    spotId: 3,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720678014/Ascent_23_f66c2q.png",
    preview: true,
  },
  {
    spotId: 3,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720678015/Ascent_22_xbhiit.png",
    preview: true,
  },
  {
    spotId: 3,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720678015/Ascent_25_hu2d4v.png",
    preview: true,
  },
  {
    spotId: 4,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720678755/Bind_1_b0a5y3.png",
    preview: true,
  },
  {
    spotId: 4,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720678759/Bind_3_f3hrmf.png",
    preview: true,
  },
  {
    spotId: 4,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720678759/Bind_3_f3hrmf.png",
    preview: true,
  },
  {
    spotId: 4,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720678761/Bind_2_adug5e.png",
    preview: true,
  },
  {
    spotId: 4,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720678761/Bind_5_wb2cxq.png",
    preview: true,
  },
  {
    spotId: 5,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720680000/Bind_14_hykf2l.png",
    preview: true,
  },
  {
    spotId: 5,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720679998/Bind_12_xb2rvt.png",
    preview: true,
  },
  {
    spotId: 5,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720679997/Bind_13_r17g9s.png",
    preview: true,
  },
  {
    spotId: 5,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720679993/Bind_11_ivggby.png",
    preview: true,
  },
  {
    spotId: 5,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720679989/Bind_10_xxugjr.png",
    preview: true,
  },
  {
    spotId: 6,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720680313/Bind_18_lsyvjc.png",
    preview: true,
  },
  {
    spotId: 6,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720680319/Bind_20_dfck1e.png",
    preview: true,
  },
  {
    spotId: 6,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720680321/Bind_21_sebdoe.png",
    preview: true,
  },
  {
    spotId: 6,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720680322/Bind_19_nbbqob.png",
    preview: true,
  },
  {
    spotId: 6,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720680323/Bind_22_yl9nof.png",
    preview: true,
  },
  {
    spotId: 7,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720749114/Bind_38_eo1l3n.png",
    preview: true,
  },
  {
    spotId: 7,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720749120/Bind_40_r5whmb.png",
    preview: true,
  },
  {
    spotId: 7,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720749117/Bind_41_g7dt1a.png",
    preview: true,
  },
  {
    spotId: 7,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720749120/Bind_39_mzth9m.png",
    preview: true,
  },
  {
    spotId: 7,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720749120/Bind_42_mcmejn.png",
    preview: true,
  },
  {
    spotId: 8,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720749821/Haven_5_etvjpa.png",
    preview: true,
  },
  {
    spotId: 8,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720749821/Haven_1_pnzhwv.png",
    preview: true,
  },
  {
    spotId: 8,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720749824/Haven_3_go8dmc.png",
    preview: true,
  },
  {
    spotId: 8,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720749825/Haven_2_a6crz0.png",
    preview: true,
  },
  {
    spotId: 8,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720749825/Haven_4_uiapgg.png",
    preview: true,
  },
  {
    spotId: 9,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720751502/Haven_8_tcgp6l.png",
    preview: true,
  },
  {
    spotId: 9,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720751497/Haven_7_j1728s.png",
    preview: true,
  },
  {
    spotId: 9,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720751500/Haven_11_lki5po.png",
    preview: true,
  },
  {
    spotId: 9,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720751501/Haven_10_muiiy9.png",
    preview: true,
  },
  {
    spotId: 9,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720751503/Haven_9_nzflcc.png",
    preview: true,
  },
  {
    spotId: 10,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720806114/Icebox_6_yonvqr.png",
    preview: true,
  },
  {
    spotId: 10,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720806115/Icebox_2_nrz7pa.png",
    preview: true,
  },
  {
    spotId: 10,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720806116/Icebox_3_bc0gph.png",
    preview: true,
  },
  {
    spotId: 10,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720806118/Icebox_4_ghy0mu.png",
    preview: true,
  },
  {
    spotId: 10,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1720806118/Icebox_1_k3cicr.png",
    preview: true,
  },
  {
    spotId: 11,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi",
    preview: true,
  },
  {
    spotId: 12,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi",
    preview: true,
  },
  {
    spotId: 13,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi",
    preview: true,
  },
  {
    spotId: 14,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi",
    preview: true,
  },
  {
    spotId: 15,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi",
    preview: true,
  },
  {
    spotId: 16,
    url: "https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi",
    preview: true,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImages, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    const spotImageIds = spotImages.map((spotImage) => spotImage.id)
    console.log("🚀 ~ down ~ spotImageIds:", spotImageIds)
    await queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: spotImageIds,
      },
    });
  },
};
