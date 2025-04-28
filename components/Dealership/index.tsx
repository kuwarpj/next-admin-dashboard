"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon, Trash2 } from "lucide-react";
import { CustomTable } from "../Common/CustomTable";
import { apiRequest } from "@/utils/apiRequest";
import { AddArticleModal } from "../Common/AddArticle";

const Dealership = () => {
  const [delearship, setDelearship] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [delearshipData, setDelearshipData] = useState({
    title: "",
    desc: "",
    image: null as File | null,
  });

  const headers = [
    { label: "Image", key: "image" },
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
  ];

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const fetchDelearship = useCallback(async () => {
    try {
      const data = await apiRequest(
        `/api/v1/admin/AutoDealerShip/allAutoDealerShip`,
        "GET"
      );
      if (data?.status === 200) {
        const articlesArray = data?.data?.[0]?.everyThing || [];
        const formattedData = articlesArray.map((article: any) => ({
          id: article?._id,
          image: article.image,
          title: article.name,
          description: article.description,
        }));
        setDelearship(formattedData);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }, []);

  useEffect(() => {
    fetchDelearship();
  }, [fetchDelearship]);

  const handleSave = useCallback(async () => {
    try {
      const formData = new FormData();
      if (delearshipData.title && delearshipData.desc) {
        formData.append("name", delearshipData.title);
        formData.append("description", delearshipData.desc);
      } else {
        console.log("Missing data:", delearshipData);
      }

      if (delearshipData.image && typeof delearshipData.image !== "string") {
        formData.append("image", delearshipData.image);
      }

      let response;
      if (isEditMode && selectedArticle?.id) {
        response = await apiRequest(
          `/api/v1/admin/Article/updateArticle/${selectedArticle.id}`,
          "PUT",
          formData
        );
      } else {
        response = await apiRequest(
          "/api/v1/admin/AutoDealerShip/addDataInEveryThing",
          "POST",
          formData
        );
      }

      if (response) {
        setDelearshipData({
          title: "",
          desc: "",
          image: null,
        });
        setIsEditMode(false);
        setOpenModal(false);
        fetchDelearship();
      }
    } catch (error) {
      console.error(error);
    }
  }, [delearshipData, isEditMode, selectedArticle, fetchDelearship]);

  const handleEdit = useCallback((data: any) => {
    setSelectedArticle(data);
    setDelearshipData({
      title: data.title,
      desc: data.description,
      image: data.image,
    });
    setIsEditMode(true);
    setOpenModal(true);
  }, []);

  const handleDeleteDelearship = useCallback(
    async (id: any) => {
      try {
        const response = await apiRequest(
          `/api/v1/admin/AutoDealerShip/deleteAutoDealerShip`,
          "DELETE",
          { id }
        );
        if (response) {
          fetchDelearship();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [fetchDelearship]
  );

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="text-[28px] font-semibold text-[#202224]">
          Auto dealership
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setOpenModal(true)}
            variant="default"
            icon={<PlusIcon className="size-4" />}
          >
            Add Auto dealership
          </Button>

          <Button variant="outline" icon={<Trash2 color="red" />} />
        </div>
      </div>

      <div className="p-4">
        <CustomTable
          headers={headers}
          onEdit={handleEdit}
          data={delearship}
          handleDeleteArticle={handleDeleteDelearship}
        />
      </div>

      <AddArticleModal
        open={openModal}
        title={isEditMode ? "Update DealerShip" : "Add Dealership"}
        onClose={() => setOpenModal(false)}
        articleData={delearshipData}
        setArticleData={setDelearshipData}
        onSave={handleSave}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      />
    </div>
  );
};

export default Dealership;
