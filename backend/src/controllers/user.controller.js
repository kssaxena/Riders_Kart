import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { io } from "../app.js";
import SendMail from "../utils/Nodemailer.js";
import { ApiKey } from "../models/api-key.model.js";
import { generateApiKey } from "../utils/apiKeyGenerator.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const AccessToken = await user.generateAccessToken();
    const RefreshToken = await user.generateRefreshToken();

    return { AccessToken, RefreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const RegisterUser = asyncHandler(async (req, res) => {
  const { name, number, email, password } = req.body;

  if (
    [name, email, password].some(function (field) {
      field.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields must be filled in");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) throw new ApiError(404, "User already exists");

  const newUser = await User.create({
    name,
    number,
    email,
    password,
  });

  const CreatedUser = await User.findById(newUser._id).select("-password ");

  if (!CreatedUser)
    throw new ApiError(
      500,
      "Failed to create user due to some internal error! Please try again"
    );

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    CreatedUser?._id
  );

  SendMail(
    email,
    "Successfully registered at Rider's Kart",
    "Welcome to Rider's Kart",
    `<b><h1>Congratulations Mr./Mrs. ${name} </h1>,<br/> <h3>You have successfully register to Rider's Kart.<br/>
    We offer several options for delivering your options

    Here are your Account details
      Name:${name}
      Contact:${number}
      Email:${email}

    If not registered from your end, kindly reply <a href="https://honeydew-mule-369122.hostingersite.com">Delete my account</a> on this email.
   </h3> <b/>`
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(201)
    .cookie("RefreshToken", RefreshToken, options)
    .cookie("AccessToken", AccessToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: CreatedUser,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "User registration completed successfully"
      )
    );
});

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(401, "email and password are required");

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "Provided email is not found");

  const isValid = await user.isPasswordCorrect(password);

  if (!isValid) throw new ApiError(401, "Entered Credential is not correct");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user?._id
  );

  io.emit("newOrder", {
    title: "Socket connect successfully",
    orderId: 12345,
    body: "Got a new order",
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("RefreshToken", RefreshToken, options)
    .cookie("AccessToken", AccessToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "User Logged In successfully"
      )
    );
});

const AdminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(401, "email and password are required");

  const Admin = await User.findOne({ email });
  if (!Admin) throw new ApiError(404, "Provided email is not found");

  if (!Admin.admin) throw new ApiError(401, "You are not an admin");

  const isValid = await Admin.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Entered Credential is not correct");
  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    Admin?._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("RefreshToken", RefreshToken, options)
    .cookie("AccessToken", AccessToken, options)
    .json(
      new ApiResponse(
        201,
        {
          Admin,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "Admin Logged In successfully"
      )
    );
});

const LogOutUser = asyncHandler(async (req, res) => {
  const LoggedOutUser = await User.findOneAndUpdate(req.user._id, {
    $set: {
      refreshToken: "1",
    },
  });

  LoggedOutUser.save();

  console.log(LoggedOutUser);
  console.log("reached Logout");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("RefreshToken", options);
});

const regenerateRefreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.RefreshToken || req.body.RefreshToken;
  const { admin } = req.body;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const DecodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(DecodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) throw new ApiError(400, "Invalid Token");

  if (admin && !user.admin) throw new ApiError(401, "You are not an admin");

  const { RefreshToken, AccessToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("RefreshToken", RefreshToken, options)
    .cookie("AccessToken", AccessToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "Refresh token regenerated successfully"
      )
    );
});

const GetAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users.length === 0) {
    res
      .status(201)
      .json(new ApiResponse(201, "No users found", "Got the data"));
  }

  res.status(201).json(new ApiResponse(201, users, "All users found"));
});

const GetUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) throw new ApiError(401, "User Id is important");

  const user = await User.findById(userId).populate("allOrders");
  if (!user) throw new ApiError(404, "User not found");

  res.status(201).json(new ApiResponse(201, user, "User details found"));
});

const ToggleBan = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.isBanned = !user.isBanned;
  user.save();
  res.status(200).json(new ApiResponse(200, user, "User status updated"));
});

const DeleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new ApiError(400, "User ID is required");
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, "User deleted successfully"));
});

const RequestForAPIKey = asyncHandler(async (req, res) => {
  const { expiresAt, type } = req.body;

  if (!type) throw new ApiError(400, "Type is required");
  if (type !== "testing" && type !== "production")
    throw new ApiError(400, "Invalid type");

  const user = await User.findById(req.user._id);

  if (!user) throw new ApiError(404, "User not found");

  if (expiresAt && new Date(expiresAt) <= new Date())
    throw new ApiError(400, "Expiration date must be in the future");

  const key = generateApiKey();

  const apiKey = new ApiKey({
    key,
    user: user._id,
    expiresAt,
    type,
  });

  await apiKey.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        "A request has been generated for the API key successfully"
      )
    );
});

const GetMyAllAPIKeys = asyncHandler(async (req, res) => {
  const apiKeys = await ApiKey.find({ user: req.user._id }).populate("user", [
    "-password",
    "-refreshToken",
  ]);

  if (apiKeys.length === 0) {
    res.status(200).json(new ApiResponse(200, {}, "No API keys found"));
  }

  res.status(200).json(new ApiResponse(200, apiKeys, "All API keys found"));
});

const DeactivateMyAPIKey = asyncHandler(async (req, res) => {
  const { apiKeyId } = req.params;

  if (!apiKeyId) throw new ApiError(400, "API key ID is required");

  const apiKey = await ApiKey.findByIdAndUpdate(apiKeyId, {
    $set: {
      isActive: false,
    },
    new: true,
  });

  if (!apiKey) throw new ApiError(404, "API key not found");

  res
    .status(200)
    .json(new ApiResponse(200, {}, "API key deactivated successfully"));
});

export {
  RegisterUser,
  Login,
  AdminLogin,
  LogOutUser,
  regenerateRefreshToken,
  GetAllUsers,
  GetUserDetails,
  ToggleBan,
  DeleteUser,
  RequestForAPIKey,
  GetMyAllAPIKeys,
  DeactivateMyAPIKey,
};
