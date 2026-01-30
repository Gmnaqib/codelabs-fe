"use client";
import React, { useEffect, useState } from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three-stdlib';
import CardField from "@/components/custom-ui/CardField";
import { getAllSchedules } from "@/services/picket/picketService";
import { Label } from "@/components/ui/label";
import { PicketPerson } from "@/types/PicketPersonProps";
import { ArrowUpRightIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";
import { PicketCardProps } from "@/types/PicketCardProps";

const PicketCard = ({ showMap, setShowMap }: PicketCardProps) => {
  const [picketData, setPicketData] = useState<PicketPerson[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        type AssignedUser = { _id: string; name: string };
        type Schedule = { assignedUsers?: AssignedUser[] };
        const data: Schedule[] = await getAllSchedules({ year, month, day, type: 'picket' });
        const withUsers = data.filter((d) => d.assignedUsers && d.assignedUsers.length > 0);
        const users: AssignedUser[] = withUsers.length > 0 ? withUsers[0].assignedUsers! : [];
        const getWeekNumber = (date: Date) => {
          const firstDay = new Date(date.getFullYear(), 0, 1);
          const days = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
          return Math.ceil((days + firstDay.getDay() + 1) / 7);
        };
        const week = getWeekNumber(today);
        const maxPicket = 6;
        const limitedUsers = users.slice(0, maxPicket);
        const rotated = limitedUsers.slice(week % limitedUsers.length).concat(limitedUsers.slice(0, week % limitedUsers.length));
        const names: PicketPerson[] = rotated.map((u) => ({
          name: u.name,
          userId: u._id,
        }));
        setPicketData(names);
      } catch (err) {
        console.error(err);
        setPicketData([]);
      }
    };
    fetchData();
  }, []);


  const groups = [
    { title: "Vacuum Cleaner", data: picketData.slice(0, 3) },
    { title: "Table & Research Tool Cleaner", data: picketData.slice(3, 6) },
  ];


  // Komponen loader GLB
  function Model() {
    const gltf = useLoader(GLTFLoader, "/3d/denahcodelabs.glb");
    return <primitive object={gltf.scene} scale={1.5} />;
  }

  return (
    <CardField title="Picket Schedule Today" icon={<ClipboardDocumentCheckIcon />} bg>
      <div className="flex flex-col gap-5">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <p className="font-medium text-sm text-center mb-2">{group.title}</p>
            <div className="flex flex-col gap-1">
              {group.data.map((person, index) => (
                <div key={index}  className="w-full flex justify-center">
                  <Label htmlFor={`${groupIndex}-${index}`} className="font-base text-sm text-muted text-center">{`${index + 1}. ${person.name.split(" ")[0]}`}</Label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setShowMap(true)}
          className="flex text-primary text-base justify-center items-center gap-2 border-none bg-transparent cursor-pointer"
        >
          See Map <ArrowUpRightIcon className="size-4" />
        </button>

        {showMap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-4 right-4 bg-white rounded-lg px-2 py-1 text-gray-500 hover:text-red-500 text-xl font-bold z-50"
              aria-label="Close"
            >
              ×
            </button>
            <div className="w-screen h-screen flex flex-col">
              <div className="flex-1">
                <Canvas camera={{ position: [-30, 20, 0], fov: 50 }} style={{ width: '100vw', height: '100vh', display: 'block' }}>
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <Model />
                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                </Canvas>
              </div>
            </div>
          </div>
        )}
      </div>
    </CardField>
  );
};

export default PicketCard;
