"use client";
import React, { useState, useCallback } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { apiRequest } from "@/utils/apiRequest";
import { useRouter } from "next/navigation";

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegistration = useCallback(async () => {
    const { fullName, email, password, phone } = formData;
    if (!fullName || !email || !password) {
      alert("Please fill in all the required fields.");
      return;
    }

    setLoading(true);

    try {
      const data = {
        fullName,
        email,
        password,
        phone,
      };

      const response = await apiRequest(
        "/api/v1/user/registration",
        "POST",
        data,
        { "Content-Type": "application/json" }
      );
      if (response) {
        alert("Registration successful!");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <div className="bg-white px-[32px] py-[23px] w-[500px] rounded-[24px] border border-[#B9B9B9]">
      <div className="flex flex-row gap-2 items-center">
        <div>
          <img src={"/image/logo.png"} alt="Logo" />
        </div>
        <div>
          <div className="text-[30px] font-semibold text-[#202224]">
            Register for an Account
          </div>
          <div className="text-[14px] font-semibold text-[#656565]">
            Please enter your details to register
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-[67px] pb-[60px]">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#202224]">
            Full Name
          </label>
          <Input
            name="fullName"
            placeholder="John Doe"
            className="h-[40px]"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#202224]">Email</label>
          <Input
            name="email"
            placeholder="user@example.com"
            className="h-[40px]"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#202224]">
            Password
          </label>
          <Input
            name="password"
            type="password"
            placeholder="********"
            className="h-[40px]"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#202224]">
            Phone (Optional)
          </label>
          <Input
            name="phone"
            placeholder="123-456-7890"
            className="h-[40px]"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4 w-full flex justify-center items-center">
          <Button
            className="w-[274px]"
            onClick={handleRegistration}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
