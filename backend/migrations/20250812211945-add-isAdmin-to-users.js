"use strict";

import { Sequelize, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, sequelize) {
  await queryInterface.addColumn("Users", "isAdmin", {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  });
}

export async function down(queryInterface, sequelize) {
  await queryInterface.removeColumn("Users", "isAdmin");
}
