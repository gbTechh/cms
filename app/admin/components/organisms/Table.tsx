import React, { useState, useEffect, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FaEllipsisH } from "react-icons/fa";
import styles from "./table.module.css";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button, Spacer, Text } from "../atoms";
import { DropdownSelect } from "../molecules";

export interface IActionOption {
  label: string;
  onClick: (item: any) => void;
}

interface Header {
  key: string;
  label: string;
  render?: RenderFunction;
}

interface DataItem {
  [key: string]: any;
}

interface Props {
  headers: Header[];
  data: DataItem[] | undefined;
  actionOptions: ActionOption[];
}

interface ActionOption {
  label: string;
  onClick: (item: any) => void;
}

interface RenderFunction {
  (item: DataItem): React.ReactNode;
}

export const Table: React.FC<Props> = ({ headers, data, actionOptions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSort = (key: string) => {
    if (key === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  let filteredData: any[] = [];
  if (data) {
    filteredData = data.filter((item) =>
      Object.values(item).some((value) => {
        return value
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }

  if (sortBy) {
    filteredData = filteredData.sort((a, b) =>
      sortOrder === "asc"
        ? a[sortBy]?.toString().localeCompare(b[sortBy]?.toString())
        : b[sortBy]?.toString().localeCompare(a[sortBy]?.toString())
    );
  }

  const totalResults = filteredData.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const toggleDropdown = (id: string) => {
    setIsOpen((prevId) => (prevId === id ? null : id));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const options = [
    { value: `${10}`, label: `${10}` },
    { value: `${20}`, label: `${20}` },
    { value: `${50}`, label: `${50}` },
    { value: `${100}`, label: `${100}` },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.topControls}>
        <div className={styles.search}>
          <IoSearchOutline className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr className={styles.headerRow}>
            {headers.map((header) => (
              <th
                key={header.key}
                onClick={() => handleSort(header.key)}
                className={`${styles.headerCell} ${
                  sortBy === header.key ? styles.sortedHeader : ""
                }`}
              >
                <Text
                  size="input"
                  fw="medium"
                  type="title"
                  className={styles.headerText}
                  color={sortBy === header.key ? "primary" : "contrast"}
                >
                  {header.label}
                  <Text
                    as="span"
                    size="input"
                    fw="medium"
                    className={styles.sortedSpan}
                  >
                    {sortOrder === "asc" ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )}
                  </Text>
                </Text>
              </th>
            ))}
            <th className={styles.actionHeader}></th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index} className={styles.dataRow}>
              {headers.map((header) => (
                <td key={header.key} className={styles.dataCell}>
                  <Text size="14" color="contrast">
                    {header.key === "thumbnail" && header.render
                      ? header.render(item)
                      : item[header.key]}
                  </Text>
                </td>
              ))}
              <td
                className={styles.actionCell}
                onClick={() => toggleDropdown(String(item.id))}
              >
                <FaEllipsisH className={styles.ellipsisIcon} />
                {isOpen === `${item.id}` && (
                  <div className={styles.dropdownMenu} ref={dropdownRef}>
                    {actionOptions.map((option) => (
                      <button
                        key={option.label}
                        className={styles.dropdownItem}
                        onClick={() => option.onClick(item)}
                      >
                        <Text
                          as="span"
                          size="input"
                          color="contrast"
                          className={styles.dropdownItemText}
                        >
                          {option.label}
                        </Text>
                      </button>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data && data.length <= 0 ? (
        <div className={styles.noData}>
          <Text color="contrast">Aun no tiene datos...</Text>
        </div>
      ) : (
        <></>
      )}
      <Spacer className={styles.spacer} />
      <div>
        <div className={styles.resultsPerPage}>
          <Text className={styles.label} as="span" size="14" color="contrast">
            Mostrar:
          </Text>
          <DropdownSelect
            options={options}
            onChange={({ value }) => {
              setResultsPerPage(parseInt(value));
              setCurrentPage(1);
            }}
            value={`${resultsPerPage}`}
          />
        </div>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              size="small"
              onClick={() => handlePageChange(index + 1)}
              className={`${styles.paginationButton} ${
                currentPage === index + 1 ? styles.activePage : ""
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
