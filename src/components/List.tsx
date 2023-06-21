import React, { useEffect, useState } from "react";
import "./List.css";

interface Country {
  name: string;
  region: string;
  area: number;
}
const ascendingSort = function (a: Country, b: Country) {
  if (a && b) {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  } else {
    return 0;
  }
};
const descendingSort = function (a: Country, b: Country) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return 1;
  } else {
    return -1;
  }
};




function List() {
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [sortFunction, setSortFunction] = useState<
    (a: Country, b: Country) => number
  >(() => ascendingSort);

  const [filterByRegion, setFilterByRegion] = useState<boolean>(false);
  const [filterByArea, setFilterByArea] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://restcountries.com/v2/all?fields=name,region,area"
      );
      if (response.ok) {
        const countries = await response.json();
        setCountryList(countries);
      } else {
        throw new Error("somthing wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1 className="list-title">Countries</h1>

      <div className="all-buttons">
        <div className="btn-container">
          <button
            onClick={() => {
              setSortFunction(() => ascendingSort);
            }}
            className="custom-button"
          >
            asending
          </button>
          <button
            onClick={() => {
              setSortFunction(() => descendingSort);
            }}
            className="custom-button"
          >
            descending
          </button>
        </div>
        <div className="btn-container">
          <button onClick={() => setFilterByRegion((prev) => !prev)}
          className="custom-button">
            “Oceania” region
          </button>
          <button onClick={() => setFilterByArea((prev) => !prev)}
          className="custom-button">
            smaller than Lithuania by area
          </button>
        </div>
      </div>
      <ul className="country-list">
        {countryList
          .sort((a, b) => {
            return sortFunction(a, b);
          })
          .filter((country) => {
            if (!filterByRegion) {
              return true;
            } else {
              return country.region == "Oceania";
            }
          })
          .filter((country) => {
            if (!filterByArea) {
              return true;
            } else {
              const Lithuania: Country | undefined = countryList.find(
                (country) => country.name == "Lithuania"
              );
              if (Lithuania) {
                return country.area <= Lithuania.area;
              }
              return false;
            }
          })
          .map((item) => {
            return (
              <li key={item.name}>
                <div className="country">
                  <div className="country-name">{item.name}</div>
                  <div className="country-region">{item.region}</div>
                  <div className="country-area">{item.area}</div>
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
}
// "name":"Afghanistan","region":"Asia","area":652230.0,"independent":false

export default List;
