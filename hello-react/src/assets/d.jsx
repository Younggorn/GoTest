import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import "../css/bootstrap.min.css";

function Home() {
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [floorOptions, setFloorOptions] = useState([]);
  const [roomOptions, setroomOptions] = useState([]);
  const [typeOptions, settypeOptions] = useState([]);

  // States for selected filters
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPeople, setSelectedPeople] = useState("");
  
  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5020/home");
      setAllRooms(response.data);

      const buildings = Array.from(new Set(response.data.map(room => room.building)))
        .map(buildingName => ({ value: buildingName, label: buildingName }));
      const floors = Array.from(new Set(response.data.map(room => room.floor)))
        .map(floorName => ({ value: floorName, label: floorName }));
      const rooms = Array.from(new Set(response.data.map(room => room.name)))
        .map(roomName => ({ value: roomName, label: roomName }));
      const types = Array.from(new Set(response.data.map(room => room.type_name)))
        .map(typeName => ({ value: typeName, label: typeName }));
      
      setBuildingOptions(buildings);
      setFloorOptions(floors);
      setroomOptions(rooms);
      settypeOptions(types);
      setFilteredRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Function to filter rooms based on selected filters
  const filterRooms = () => {
    let filtered = allRooms;

    if (selectedBuilding) {
      filtered = filtered.filter(room => room.building === selectedBuilding.value);
    }
    if (selectedFloor) {
      filtered = filtered.filter(room => room.floor === selectedFloor.value);
    }
    if (selectedRoom) {
      filtered = filtered.filter(room => room.name === selectedRoom.value);
    }
    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(room => room.type_name === selectedType.label);
    }
    if (selectedPeople) {
      const peopleCount = parseInt(selectedPeople, 10);
      filtered = filtered.filter(room => room.cap >= peopleCount);
    }

    setFilteredRooms(filtered);
  };

  // Trigger filtering whenever a filter value changes
  useEffect(() => {
    filterRooms();
  }, [selectedBuilding, selectedFloor, selectedRoom, selectedType, selectedPeople]);

  const resetFilters = () => {
    setSelectedBuilding(null);
    setSelectedFloor(null);
    setSelectedRoom(null);
    setSelectedType("all");
    setSelectedPeople("");
    setFilteredRooms(allRooms);
  };

  return (
    <div className="container">
      <div className="row mb-3" style={{ marginTop: "20px" }}>
        <div className="col-md-3 mb-2">
          <Select
            options={buildingOptions}
            value={selectedBuilding}
            onChange={setSelectedBuilding}
            placeholder="ค้นหาตึก..."
          />
        </div>
        <div className="col-md-3 mb-2">
          <Select
            options={floorOptions}
            value={selectedFloor}
            onChange={setSelectedFloor}
            placeholder="ค้นหาชั้น..."
          />
        </div>
        <div className="col-md-3 mb-2">
          <Select
            options={roomOptions}
            value={selectedRoom}
            onChange={setSelectedRoom}
            placeholder="ค้นหาห้อง..."
          />
        </div>
        <div className="col-md-3 mb-2">
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={setSelectedType}
            placeholder="ค้นหาประเภทห้อง..."
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            className="form-control"
            type="number"
            value={selectedPeople}
            onChange={(e) => setSelectedPeople(e.target.value)}
            placeholder="จำนวนคน"
            aria-label="จำนวนคน"
          />
        </div>
        <div className="col-md-2 mb-2 mt-4">
          <button
            className="btn btn-outline-danger w-100"
            onClick={resetFilters}
          >
            ล้างข้อมูล
          </button>
        </div>
      </div>

      <div className="row" style={{ padding: "10px" }}>
        {filteredRooms && filteredRooms.length > 0 ? (
          filteredRooms.map((room, index) => (
            <div className="col-md-3 col-sm-6 mb-4" key={index}>
              <div
                className="card shadow"
                style={{
                  width: "18rem",
                  height: "22rem",
                  borderRadius: "15px",
                  border: "1px solid #ddd",
                  backgroundColor: "#A4C6CC",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={room.room_pic}
                    className="card-img-top"
                    alt="room.room_pic"
                    style={{ width: "18rem", height: "10rem", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      backgroundColor: room.type_name === "VIP Room" ? "rgba(255, 215, 0, 0.8)" : "#72B676",
                      color: "black",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {room.type_name}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#EED1A2",
                      color: "black",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {room.cap} Peoples
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{room.name}</h5>
                  <p className="card-text mb-5">
                    {room.building} <br /> {room.floor} <br /> {room.time}
                  </p>
                  <button className="btn btn-primary" style={{ width: "150px" }}>
                    เลือก
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-danger mt-2">ไม่พบห้องที่ต้องการ</p>
        )}
      </div>
    </div>
  );
}

export default Home;
