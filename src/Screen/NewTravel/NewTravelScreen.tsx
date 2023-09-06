import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./NewTravelScreen.css"; // Importa il file CSS per lo stile
import { getDistanceMatrix } from "../../api/maps";
import { DistanceMatrixService, useJsApiLoader } from "@react-google-maps/api";
import { TravelData } from "../../types/travel";
import { useTravelStore } from "../zustand/TravelStore";

export const NewTravelScreen: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyABZcj72gsF9LjTJ8azu9JSHaalbEk1zLc",
  });
  const {
    createTravel,
    currentTravel,
    endTravel,
    rider: currentRider,
    setCurrentTravel,
  } = useTravelStore();

  // input fields
  const [usernameInput, setUsernameInput] = useState(currentRider);
  const [adressInput, setAddressInput] = useState("");

  // UI states
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isIdle, setIsIdle] = useState(true);

  const departure = useMemo(() => {
    return currentTravel?.travel_departure
      ? new Date(currentTravel.travel_departure)
      : new Date();
  }, [currentTravel]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(e.target.value);
  };

  const handleAddressInputSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsIdle(false);
  };

  const handleConfirm = async () => {
    if (currentTravel) {
      const travelData: TravelData = {
        ...currentTravel,
        travel_departure: String(new Date()),
        travel_status: "progress",
        travel_rider: usernameInput,
      };
      await createTravel(travelData);
      setIsConfirmationShown(false);
    }
  };

  const handleCancel = () => {
    setIsConfirmationShown(false);
  };

  const handleCancelTravel = () => {
    setCurrentTravel(undefined);
  };

  useEffect(() => {
    // Inizializza il form qui se necessario
    console.log("trabel", currentTravel);
  }, [currentTravel]);

  const handleDistanceMatrixResponse = (response: any) => {
    if (response.rows[0].elements[0].status === "OK") {
      const address = response.destinationAddresses[0];
      const distance = (
        response.rows[0].elements[0].distance.value / 1000
      ).toFixed(2);
      // durata di andata, ritorno e totale
      const durationOutward = response.rows[0].elements[0].duration.value / 60;
      const durationReturn = response.rows[1].elements[1].duration.value / 60;
      const duration = Math.round(durationOutward + durationReturn) + 5;
      // orario di arrivo e ritorno
      const expectedArrivalTime = new Date(
        Date.now() + durationOutward * 1000 * 60
      ).toLocaleTimeString();
      const expectedReturnTime = new Date(
        Date.now() + duration * 60 * 1000
      ).toLocaleTimeString();

      const travelData: TravelData = {
        travel_address: address,
        travel_distance: distance,
        travel_estimed_time_minutes: duration,
        travel_expected_arrival_time: expectedArrivalTime,
        travel_expected_return_time: expectedReturnTime,
      };

      setCurrentTravel({ ...currentTravel, ...travelData });
      setIsConfirmationShown(true);
    }
  };

  const handleEndTravel = useCallback(
    async (status: "canceled" | "completed") => {
      if (currentTravel) {
        console.log("_id", currentTravel._id);
        const travelData: TravelData = {
          ...currentTravel,
          travel_status: status,
          travel_elapsed_time: currentTravel.travel_elapsed_time,
          travel_arrival: String(new Date()),
        };
        await endTravel(travelData);
        setCurrentTravel(undefined);
      }
    },
    [currentTravel, endTravel, setCurrentTravel]
  );

  //update elasped travel time
  useEffect(() => {
    if (currentTravel?.travel_departure) {
      const interval = setInterval(() => {
        const elapsedTravelTime = Math.round(
          (Date.now() - departure.getTime()) / 1000 / 60
        );
        const travelData: TravelData = {
          ...currentTravel,
          travel_elapsed_time: elapsedTravelTime.toString(),
        };
        setCurrentTravel({ ...currentTravel, ...travelData });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentTravel, setCurrentTravel]);

  return (
    <div className="container">
      {isConfirmationShown ? (
        <div className="confirmation">
          <h3>Conferma dati consegna</h3>
          <h5
            style={{ fontWeight: "bold" }}
          >{`${currentTravel?.travel_address}`}</h5>
          <p>
            {`
                Rider: ${usernameInput}`}
          </p>
          <p>{`Distanza: ${currentTravel?.travel_distance} km`}</p>
          <p>{`Durata (A/R): ${currentTravel?.travel_estimed_time_minutes} minuti`}</p>
          <p>{`Orario consegna: ${currentTravel?.travel_expected_arrival_time}`}</p>
          <p>{`Orario rientro: ${currentTravel?.travel_expected_return_time}`}</p>

          <button onClick={handleConfirm}>Si</button>
          <button onClick={handleCancel}>No</button>
        </div>
      ) : currentTravel?.travel_departure ? (
        <div className="completed-travel">
          <p style={{ fontWeight: "bold" }}>
            {currentRider}, il tuo viaggio è in corso
          </p>
          <p>Destinazione: {currentTravel?.travel_address}</p>
          <p>Orario di partenza: {departure?.toLocaleTimeString()}</p>
          <p>
            Orario previsto di rientro:{" "}
            {currentTravel?.travel_expected_return_time}
          </p>
          <p>Tempo impiegato: {currentTravel?.travel_elapsed_time} minuti</p>
          <button
            onClick={() => {
              handleEndTravel("canceled");
            }}
          >
            Annulla viaggio
          </button>
          <button
            onClick={() => {
              handleEndTravel("completed");
            }}
          >
            Termina viaggio
          </button>
        </div>
      ) : (
        <form className="form-container" onSubmit={handleAddressInputSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={usernameInput}
              onChange={handleUsernameChange}
              required
            />
          </label>
          <label>
            Indirizzo di destinazione:
            <input
              type="text"
              value={adressInput}
              onChange={handleAddressChange}
              required
            />
          </label>
          <button type="submit">Avvia viaggio</button>
        </form>
      )}

      {adressInput && !isIdle && (
        <DistanceMatrixService
          options={{
            destinations: [adressInput, "Via Giusti, 128, Calenzano FI"],
            origins: ["Via Giusti, 128, Calenzano FI", adressInput],
            travelMode: google?.maps?.TravelMode?.DRIVING,
          }}
          callback={(response) => {
            handleDistanceMatrixResponse(response);
            setIsIdle(true);
          }}
        />
      )}
    </div>
  );
};
