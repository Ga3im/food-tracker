import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { useState } from "react";
import { DatabaseForm } from "../components/DatabaseForm";
import { deleteProductDatabaseOffline, useAppDispatch, useAppSelector } from "../store";
import { useContextMenu } from "../hooks/useContextMenu";
import type { BaseProduct } from "../types";

const PlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const Database = () => {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);

  const { databaseProducts } = useAppSelector((state) => state.meal);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { contextMenu, setContextMenu, handleContextMenu, handleTouchStart, clearTouchTimer } =
    useContextMenu<BaseProduct>();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleOpenForm = () => {
    setIsOpenForm(!isOpenForm);
  };

  const handleDelete = () => {
    dispatch(deleteProductDatabaseOffline(contextMenu.item.id));
    setContextMenu(null);
  };

  const sortedFoodDatabase = [...(databaseProducts || [])].sort((a, b) => a.name.localeCompare(b.name, "ru"));

  return (
    <>
      {isOpenForm && <DatabaseForm setIsOpenForm={setIsOpenForm} />}

      <div className="px-4">
        <BackButton onBackClick={handleBackClick} />
        <div className="p-2">
          <h2>База данных</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600">
                <th className="py-3 px-3 border-r border-slate-200">Название</th>
                <th className="py-3 px-2 border-r border-slate-200 text-center">
                  Б <br />
                  (г)
                </th>
                <th className="py-3 px-2 border-r border-slate-200 text-center">
                  Ж <br />
                  (г)
                </th>
                <th className="py-3 px-2 border-r border-slate-200 text-center">
                  У <br />
                  (г)
                </th>
                <th className="py-3 px-1 text-center">Ккал</th>
              </tr>
            </thead>
            <tbody>
              {sortedFoodDatabase.map((item) => {
                return (
                  <div
                    className="contents"
                    key={item.name}
                    onContextMenu={(e) => handleContextMenu(e, item)}
                    onTouchStart={(e) => handleTouchStart(e, item)}
                    onTouchMove={clearTouchTimer}
                    onTouchEnd={clearTouchTimer}
                    onTouchCancel={clearTouchTimer}
                  >
                    <tr className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-2 font-semibold text-slate-800 text-sm border-r border-slate-200 break-words">
                        {item.name}
                      </td>
                      <td className="text-center py-3 px-2 text-slate-600 text-sm border-r border-slate-200">
                        {item.proteins.toFixed(1)}
                      </td>
                      <td className="text-center py-3 px-2 text-slate-600 text-sm border-r border-slate-200">
                        {item.fats.toFixed(1)}
                      </td>
                      <td className="text-center py-3 px-2 text-slate-600 text-sm border-r border-slate-200">
                        {item.carbs.toFixed(1)}
                      </td>
                      <td className="text-center py-3 px-3 font-bold text-slate-900 text-sm">
                        {item.calories.toFixed(0)}
                      </td>
                    </tr>
                  </div>
                );
              })}
            </tbody>
          </table>
          {!isOpenForm && (
            <div className="fixed bottom-6 left-0 right-0 px-4">
              <button
                onClick={handleOpenForm}
                className="max-w-md mx-auto w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-transform active:scale-[0.98] shadow-xl shadow-indigo-200"
              >
                <>
                  <PlusIcon />
                  <span>Добавить продукт в базу данных</span>
                </>
              </button>
            </div>
          )}
          {contextMenu && (
            <div
              style={{
                top: `${contextMenu.y}px`,
                left: `${contextMenu.x}px`,
                position: "fixed",
              }}
              className="z-[9999] pointer-events-auto min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-2xl p-1.5 flex flex-col font-sans select-none"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
            >
              <button
                onClick={() => handleDelete()}
                className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                🗑️ Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
