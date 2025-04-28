"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

      const response = await fetch(`${API_URL}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.accessToken) {
        Cookies.set("accessToken", data.accessToken, { expires: 1 }); 
        Cookies.set("user", JSON.stringify(data.data), { expires: 1 }); 

        router.push("/dashboard");
      } else {
        throw new Error("Access token not found");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-[32px] py-[23px] w-[500px] rounded-[24px] border border-[#B9B9B9]">
      <div className="flex flex-row gap-2 items-center">
        <div>
          <img src={"/image/logo.png"} alt="Logo" />
        </div>
        <div>
          <div className="text-[30px] font-semibold text-[#202224]">
            Login to Account
          </div>
          <div className="text-[14px] font-semibold text-[#656565]">
            Please enter your email and password to continue
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-[67px] pb-[60px]">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#202224]">Email</label>
          <Input
            name="email"
            placeholder="admin@gmail.com"
            className="h-[40px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#202224]">
            Password
          </label>
          <Input
            name="password"
            type="password"
            placeholder="your password"
            className="h-[40px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-4 w-full flex justify-center items-center">
          <Button
            className="w-[274px]"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
      <div className="flex justify-center gap-1 items-center text-sm font-medium">
        Don't have a account{" "}
        <span
          onClick={() => {
            router.push("/registration");
          }}
          className="text-[#2D98A6] cursor-pointer"
        >
          Sign Up
        </span>
      </div>
    </div>
  );
};

export default Login;
