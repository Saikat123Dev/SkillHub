// import { register } from "@/actions/register";
// import { getUserByEmail } from "@/data/user";
// import { db } from "@/lib/db";
// import bcrypt from "bcryptjs";

// jest.mock("@/data/user", () => ({
//   getUserByEmail: jest.fn(),
// }));

// jest.mock("@/lib/db", () => ({
//   db: {
//     user: {
//       create: jest.fn(),
//     },
//   },
// }));

// jest.mock("bcryptjs", () => ({
//   hash: jest.fn(),
// }));

// describe("register", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should register a new user successfully", async () => {
//     const mockUser = {
//       name: "John Doe",
//       email: "johndoe@example.com",
//       password: "Password123",
//       birthday: "2000-01-01",
//     };

//     getUserByEmail.mockResolvedValue(null);
//     bcrypt.hash.mockResolvedValue("hashedPassword123");
//     db.user.create.mockResolvedValue({ id: 1, ...mockUser });

//     const result = await register(mockUser);

//     expect(result).toEqual({ success: "Registration completed" });
//     expect(getUserByEmail).toHaveBeenCalledWith(mockUser.email);
//     expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
//     expect(db.user.create).toHaveBeenCalledWith({
//       data: {
//         name: mockUser.name,
//         email: mockUser.email,
//         password: "hashedPassword123",
//         birthday: mockUser.birthday,
//       },
//     });
//   });

//   it("should return an error for invalid fields", async () => {
//     const invalidUser = {
//       name: "",
//       email: "invalidemail",
//       password: "short",
//       birthday: "not-a-date",
//     };

//     const result = await register(invalidUser);

//     expect(result).toEqual({ error: "Invalid fields!" });
//     expect(getUserByEmail).not.toHaveBeenCalled();
//     expect(bcrypt.hash).not.toHaveBeenCalled();
//     expect(db.user.create).not.toHaveBeenCalled();
//   });

//   it("should return an error if the email is already in use", async () => {
//     const mockUser = {
//       name: "John Doe",
//       email: "johndoe@example.com",
//       password: "Password123",
//       birthday: "2000-01-01",
//     };

//     getUserByEmail.mockResolvedValue({ id: 1, ...mockUser });

//     const result = await register(mockUser);

//     expect(result).toEqual({ error: "Email already in use!" });
//     expect(getUserByEmail).toHaveBeenCalledWith(mockUser.email);
//     expect(bcrypt.hash).not.toHaveBeenCalled();
//     expect(db.user.create).not.toHaveBeenCalled();
//   });

//   it("should return an error if registration fails", async () => {
//     const mockUser = {
//       name: "John Doe",
//       email: "johndoe@example.com",
//       password: "Password123",
//       birthday: "2000-01-01",
//     };

//     getUserByEmail.mockResolvedValue(null);
//     bcrypt.hash.mockResolvedValue("hashedPassword123");
//     db.user.create.mockRejectedValue(new Error("DB Error"));

//     const result = await register(mockUser);

//     expect(result).toEqual({ error: "Failed to register user. Please try again." });
//     expect(getUserByEmail).toHaveBeenCalledWith(mockUser.email);
//     expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
//     expect(db.user.create).toHaveBeenCalled();
//   });
// });
