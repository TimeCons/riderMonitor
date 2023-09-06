import React, { useEffect, useState } from "react";
import { getAllTravels } from "../../api/travel";
import { TravelData } from "../../types/travel";
import { useTravelStore } from "../zustand/TravelStore";
import "./HomeScreen.css";

export // Componente Home
const HomeScreen = () => {
  const [travels, setTravels] = useState<TravelData[]>([]);
  const { currentTravel } = useTravelStore();

  const fetchTravels = async () => {
    const res = await getAllTravels();
    setTravels(res);
  };

  useEffect(() => {
    console.log("currentTravel", currentTravel);
    fetchTravels();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Indirizzo</th>
            <th>T. stimato</th>
            <th>T. Impiegato</th>
            <th>Distanza</th>
            {/* <th>arrivo stimato</th> */}
            <th>rientro stimato</th>
            <th>rientro</th>
            <th>partenza</th>
            <th>Stato</th>
            <th>Rider</th>
          </tr>
        </thead>
        <tbody>
          {travels.map((travel) => (
            <tr key={travel._id}>
              <td>{travel.travel_address}</td>
              <td>{travel.travel_estimed_time_minutes} min</td>
              <td
                style={{
                  color:
                    (travel.travel_estimed_time_minutes ?? 0) >=
                    (Number(travel.travel_elapsed_time) ?? 0)
                      ? "green"
                      : "red",
                }}
              >
                {travel.travel_elapsed_time
                  ? travel.travel_elapsed_time + " min"
                  : "..."}
              </td>
              <td>{travel.travel_distance} km</td>
              {/* <td>{travel.travel_expected_arrival_time}</td> */}
              <td>{travel.travel_expected_return_time}</td>
              <td>
                {travel.travel_arrival
                  ? new Date(travel.travel_arrival ?? "").toLocaleTimeString()
                  : "..."}
              </td>

              <td>
                {new Date(travel.travel_departure ?? "").toLocaleDateString()}{" "}
                {new Date(travel.travel_departure ?? "").toLocaleTimeString()}
              </td>
              <td>{travel.travel_status}</td>
              <td>{travel.travel_rider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
