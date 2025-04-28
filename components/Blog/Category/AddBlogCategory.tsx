"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon } from "lucide-react";

interface AddBlogCategoryModalProps {
  open: boolean;
  onClose: () => void;
  articleData: any;
  setArticleData: any;
  onSave: () => void;
  isEditMode: boolean; // Accept isEditMode prop
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  type?: string;
  loading?: any;
}

export function AddBlogCategoryModal({
  open,
  onClose,
  articleData,
  setArticleData,
  onSave,
  isEditMode,
  setIsEditMode,
  title,
  type,
  loading,
}: AddBlogCategoryModalProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArticleData((prev: any) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setArticleData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    onClose();
    setIsEditMode(false);
    setArticleData({
      title: "",
      desc: "",
      image: null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle> {/* Toggle title */}
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {type === "page" && (
            <div className="flex justify-center">
              <label className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer relative overflow-hidden">
                {articleData.image ? (
                  <img
                    src={
                      typeof articleData.image === "string"
                        ? articleData.image
                        : URL.createObjectURL(articleData.image)
                    }
                    alt="Uploaded"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <UploadIcon className="w-8 h-8 text-gray-400" />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <Input
              name="title"
              placeholder="Enter Title"
              value={articleData.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              name="desc"
              placeholder="Enter Description"
              value={articleData.desc}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        <div className="mt-4 w-full  flex justify-center items-center">
          <Button className="w-[274px]" onClick={onSave}>
            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
              ? "Update"
              : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
