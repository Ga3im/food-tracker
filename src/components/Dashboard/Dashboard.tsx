import { useEffect, useState } from "react";
import { History } from "../History/History";
import { Options } from "../Options/Options";
import { useIsDesktop } from "../../hooks/useIsDesktop";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"actions" | "history" | "both">(
    "actions"
  );
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );

  const { isDesktop } = useIsDesktop();
  useEffect(() => {
    if (isDesktop) {
      setActiveTab("both");
    } else {
      setActiveTab("actions");
    }
  }, [isDesktop]);
  
  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart({
      ...touchStart,
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const horizontal = touchStart.x - touchEndX;
    const vertical = touchStart.y - touchEndY;

    if (horizontal > 50 && Math.abs(vertical) < Math.abs(horizontal))
      setActiveTab("history"); // Свайп влево
    if (horizontal < -50 && Math.abs(vertical) < Math.abs(horizontal))
      setActiveTab("actions"); // Свайп вправо
    setTouchStart(null);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-slate-50 px-4 sm:p-8 font-sans"
    >
      {/* Точки-индикаторы вверху */}
      <div className="flex justify-center gap-2 py-2 md:hidden">
        <div
          onClick={() => setActiveTab("actions")}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            activeTab === "actions" ? "w-8 bg-indigo-600" : "w-2 bg-slate-300"
          }`}
        />
        <div
          onClick={() => setActiveTab("history")}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            activeTab === "history" ? "w-8 bg-indigo-600" : "w-2 bg-slate-300"
          }`}
        />
      </div>

      {activeTab === "actions" && <Options />}

      {activeTab === "history" && <History setActiveTab={setActiveTab} />}

      {activeTab === "both" && (
        <div className="md:grid md:grid-cols-2">
          <History setActiveTab={setActiveTab} />
          <Options />
        </div>
      )}
    </div>
  );
};
