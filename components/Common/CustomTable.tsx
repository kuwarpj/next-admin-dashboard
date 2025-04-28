// "use client";

// import * as React from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";

// import { Pencil, Trash2 } from "lucide-react";

// interface TableProps {
//   data: any;
//   onEdit?: (article: any) => void;
//   handleDeleteArticle?: any;
//   headers?: string[];
// }

// export function CustomTable({
//   data,
//   onEdit,
//   handleDeleteArticle,
//   headers,
// }: TableProps) {
//   const [selectedItems, setSelectedItems] = React.useState<Set<number>>(
//     new Set()
//   );

//   const handleSelect = (id: number) => {
//     setSelectedItems((prev) => {
//       const newSelectedItems = new Set(prev);
//       if (newSelectedItems.has(id)) {
//         newSelectedItems.delete(id);
//       } else {
//         newSelectedItems.add(id);
//       }
//       return newSelectedItems;
//     });
//   };

//   const defaultHeaders = ["Image", "Title", "Description", "Operation"];
//   const headersToRender = headers?.length ? headers : defaultHeaders;

//   const tableData = Array.isArray(data) ? data : [];

//   return (
//     <div className="rounded-md border overflow-x-auto">
//       <table className="w-full text-sm text-left">
//         <thead className="bg-gray-100 dark:bg-gray-800 border-[0.6px] border-[#D5D5D5]">
//           <tr>
//             <th className="p-3 font-semibold">
//               <Checkbox
//                 checked={selectedItems.size === tableData.length}
//                 onCheckedChange={() => {
//                   if (selectedItems.size === tableData.length) {
//                     setSelectedItems(new Set());
//                   } else {
//                     setSelectedItems(new Set(tableData.map((item) => item.id)));
//                   }
//                 }}
//               />
//             </th>
//             {headersToRender.map((label, index) => (
//               <th key={index} className="p-3 font-semibold">
//                 {label}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody className="bg-[#FFFFFF]">
//           {tableData?.map((item: any, index: number) => (
//             <tr key={index} className="border-[0.6px] border-[#D5D5D5]">
//               <td className="py-4 px-3 align-middle">
//                 <Checkbox
//                   checked={selectedItems.has(item.id)}
//                   onCheckedChange={() => handleSelect(item.id)}
//                 />
//               </td>

//               <td className="py-4 px-3 align-middle">
//                 {item.image && (
//                   <img
//                     src={item.image}
//                     alt={item.title}
//                     className="w-12 h-12 object-cover rounded-md"
//                   />
//                 )}
//               </td>

//               <td className="py-4 px-3 align-middle">{item.title}</td>

//               <td className="py-4 px-3 align-middle">{item.desc}</td>

//               <td className="py-4 px-3 align-middle">
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => onEdit?.(item)}
//                     icon={<Pencil className="size-4" />}
//                     className="bg-[#CCF0EB] text-[#00B69B] text-xs font-bold flex items-center justify-center gap-2"
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     onClick={() => {
//                       handleDeleteArticle(item?.id);
//                     }}
//                     variant="destructive"
//                     className="bg-[#FED8E0] text-[#F80036] hover:text-white text-xs font-bold flex items-center justify-center gap-2"
//                     size="sm"
//                     icon={<Trash2 className="size-4" />}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";

interface Header {
  label: string;
  key: string;
}

interface TableProps {
  data: any[];
  onEdit?: (article: any) => void;
  handleDeleteArticle?: (id: number) => void;
  headers: Header[];
  type?: string;
}

export function CustomTable({
  data = [],
  onEdit,
  handleDeleteArticle,
  headers,
  type,
}: TableProps) {
  const [selectedItems, setSelectedItems] = React.useState<Set<number>>(
    new Set()
  );

  const handleSelect = (id: number) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        newSelectedItems.add(id);
      }
      return newSelectedItems;
    });
  };

  const allSelected = selectedItems.size === data.length && data.length > 0;

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 border-[0.6px] border-[#D5D5D5]">
          <tr>
            <th className="p-3 font-semibold">
              <Checkbox
                checked={allSelected}
                onCheckedChange={() => {
                  if (allSelected) {
                    setSelectedItems(new Set());
                  } else {
                    setSelectedItems(new Set(data.map((item) => item.id)));
                  }
                }}
              />
            </th>
            {headers.map((header, index) => (
              <th key={index} className="p-3 font-semibold">
                {header.label}
              </th>
            ))}
            <th className="p-3 font-semibold">Operation</th>
          </tr>
        </thead>

        <tbody className="bg-[#FFFFFF]">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length + 2}
                className="text-center py-6 text-gray-500"
              >
                No data found.
              </td>
            </tr>
          ) : (
            data.map((item: any, index: number) => (
              <tr key={index} className="border-[0.6px] border-[#D5D5D5]">
                <td className="py-4 px-3 align-middle">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={() => handleSelect(item.id)}
                  />
                </td>

                {headers.map((header, idx) => (
                  <td key={idx} className="py-4 px-3 align-middle">
                    {header.key === "image" && item[header.key] ? (
                      <img
                        src={item[header.key]}
                        alt={item.title || "Image"}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      item[header.key] ?? "-"
                    )}
                  </td>
                ))}

                <td className="py-4 px-3 align-middle">
                  <div className="flex items-center gap-2">
                    {type != "blog_page" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(item)}
                        icon={<Pencil className="size-4" />}
                        className="bg-[#CCF0EB] text-[#00B69B] text-xs font-bold flex items-center justify-center gap-2"
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeleteArticle?.(item?.id)}
                      variant="destructive"
                      size="sm"
                      icon={<Trash2 className="size-4" />}
                      className="bg-[#FED8E0] text-[#F80036] hover:text-white text-xs font-bold flex items-center justify-center gap-2"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
