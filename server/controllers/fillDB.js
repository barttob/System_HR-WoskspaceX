import { db } from "../connect.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export async function createRandomUser() {
  for (let i = 0; i < 1000; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const login = faker.internet.userName();
    const password = await bcrypt.hash(login, 10);
    const phone = faker.phone.number();
    const email = faker.internet.email();
    const b_date = faker.date.birthdate();
    const image = faker.image.abstract();

    let role = "";
    let rnd = Math.floor(Math.random() * 10);
    switch (rnd) {
      case 0:
        role = "adm"; //admin
        break;
      case 1:
        role = "per"; //kadrowy
        break;
      case 2:
        role = "acc"; //księgowa
        break;
      case 3:
        role = "sv"; //opiekun
        break;
      case 4:
        role = "emp"; //pracownik
        break;
      case 5:
        role = "emp"; //pracownik
        break;
      case 6:
        role = "emp"; //pracownik
        break;
      case 7:
        role = "emp"; //pracownik
        break;
      case 8:
        role = "emp"; //pracownik
        break;
      case 9:
        role = "emp"; //pracownik
        break;
    }

    db.query(
      "INSERT INTO users (first_name, last_name, login, password, phone, email, user_role, birth_date, address_id, img_url) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        firstName,
        lastName,
        login,
        password,
        phone,
        email,
        role,
        b_date,
        i + 101,
        image,
      ]
    );
  }
}

export async function createRandomAddress() {
  for (let i = 0; i < 1000; i++) {
    const address2 = faker.address.buildingNumber();
    const address1 = faker.address.street();
    const postal_code = faker.address.zipCode();
    const city = faker.address.city();
    const country = faker.address.country();

    db.query(
      "INSERT INTO address (address2, address1, postal_code, country, city) VALUES (?,?,?,?,?)",
      [address2, address1, postal_code, country, city]
    );
  }
}
