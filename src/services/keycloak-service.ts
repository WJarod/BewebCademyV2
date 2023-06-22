import axios from "axios";
import IUserModel from "../model/IUserModel";
import token from "../assets/auth/keycloak_token.js";

export const getUsers = async (): Promise<IUserModel[]> => {
  var users: IUserModel[] = [];
  try {
    const access_token = await token();
    var config = {
      method: "get",
      url: "http://51.83.69.138:8080/admin/realms/Bewebcademy/users/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

    //return user list from keycloak
    const response = await axios(config);
    const data = response.data;
    data.forEach((user: any) => {
      console.log(user);
      users.push({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    });
    return users;
  } catch (error) {
    console.log(error);
    return users;
  }
};

export const getUser = async (id: string): Promise<IUserModel> => {
  var user: IUserModel = {
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  };

  try {
    const access_token = await token();
    var config = {
      method: "get",
      url: "http://51.83.69.138:8080/admin/realms/Bewebcademy/users/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

    //return user list from keycloak
    const response = await axios(config);
    const data = response.data;
    data.forEach((user: any) => {
      user = ({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    });
    return user;
  } catch (error) {
    console.log(error);
    return user;
  }
};

export const updateUser = async (id: string, user: IUserModel) => {
  console.log(user);
  
  try {
    const access_token = await token();
    try {
      var data = JSON.stringify(user);

      var config = {
        method: "put",
        url: "http://51.83.69.138:8080/admin/realms/Bewebcademy/users/" + id,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        data: data,
      };

      axios(config)
        .then(function () {
          console.log("User updated");
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const access_token = await token();
    try {
      var config = {
        method: "delete",
        url: "http://51.83.69.138:8080/admin/realms/Bewebcademy/users/" + id,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      };

      axios(config)
        .then(function () {
          console.log("User deleted");
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};