import React, { useEffect, useMemo, useState } from "react";
import { endTravel, getAllTravels, updateTravel } from "../../api/travel";
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
    //chiama fetchtravels ogni minuto
    fetchTravels();
    const interval = setInterval(() => {
      fetchTravels();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const atLeastOneProgress = useMemo(() => {
    return travels.some((travel) => travel.travel_status === "progress");
  }, [travels]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Indirizzo</th>
            <th>T. stimato</th>
            <th>T. Impiegato</th>
            {/* <th>Distanza</th> */}
            {/* <th>arrivo stimato</th> */}
            <th>rientro stimato</th>
            {/* <th>rientro</th>
            <th>partenza</th> */}
            <th>Stato</th>
            <th>Rider</th>
          </tr>
        </thead>
        <tbody>
          {travels.map((travel) => (
            <tr
              key={travel._id}
              // se il giorno è diverso da oggi, allora il colore è rosso non troppo acceso
              style={{
                backgroundColor:
                  new Date(
                    travel.travel_departure ?? ""
                  ).toLocaleDateString() !== new Date().toLocaleDateString()
                    ? "#ffcccc"
                    : "",
              }}
            >
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
                {travel.travel_elapsed_time !== undefined ? (
                  travel.travel_elapsed_time + " min"
                ) : (
                  <button
                    onClick={() => {
                      endTravel(travel).then(() => {
                        fetchTravels();
                      });
                    }}
                  >
                    Termina
                  </button>
                )}
              </td>
              {/* <td>{travel.travel_distance} km</td> */}
              {/* <td>{travel.travel_expected_arrival_time}</td> */}
              <td>{travel.travel_expected_return_time}</td>
              {/* <td>
                {travel.travel_arrival
                  ? new Date(travel.travel_arrival ?? "").toLocaleTimeString()
                  : "..."}
              </td>

              <td>
                {new Date(travel.travel_departure ?? "").toLocaleDateString()}{" "}
                {new Date(travel.travel_departure ?? "").toLocaleTimeString()}
              </td> */}
              <td>
                {travel.travel_status === "progress"
                  ? "in corso"
                  : travel.travel_status === "completed"
                  ? "completato"
                  : "annullato"}
              </td>
              <td>{travel.travel_rider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
