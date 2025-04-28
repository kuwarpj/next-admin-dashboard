'use client'
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { CustomTable } from "../Common/CustomTable";
import { apiRequest } from "@/utils/apiRequest";

const Blog = () => {
  const [blog, setBlog] = useState<any[]>([]);


    const fetchBlog = useCallback(async () => {
      try {
        const data = await apiRequest(`/api/v1/admin/AutoDealerShip/allAutoDealerShip`, "GET");
        if (data?.status === 200) {
          const articlesArray = data?.data?.[0]?.everyThing || [];
          const formattedData = articlesArray.map((article: any) => ({
            id: article?._id,
            image: article.image,
            title: article.name,
            desc: article.description,
          }));
          setBlog(formattedData);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }, []);
  
    useEffect(() => {
        fetchBlog();
    }, [fetchBlog]);

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="text-[28px] font-semibold text-[#202224]">
          Blog Category
        </div>

        <div className="flex gap-2 ">
          <div>
            <Button
              //   onClick={() => setOpenModal(true)}
              variant={"default"}
              icon={<PlusIcon className="size-4" />}
            >
              Add new blog
            </Button>
          </div>

          <div>
            <Button
              variant={"outline"}
              icon={<img src="./svg/delete.svg" alt="Delete" />}
            ></Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* <CustomTable
          onEdit={handleEdit}
          data={articles}
          handleDeleteArticle={handleDeleteDelearship}
        /> */}
      </div>
    </div>
  );
};

export default Blog;
