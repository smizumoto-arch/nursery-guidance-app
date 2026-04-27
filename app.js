const { useState, useEffect } = React;

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

const defaultData = [
  {
    id: "1",
    name: "さくら保育園",
    checklist: [
      { id: "c1", text: "園の概要説明", completed: false },
      { id: "c2", text: "料金体系の説明", completed: false },
      { id: "c3", text: "持ち物・ルールの説明", completed: false }
    ]
  }
];

function App() {
  const [nurseries, setNurseries] = useState([]);
  const [selectedNurseryId, setSelectedNurseryId] = useState("");
  const [newNurseryName, setNewNurseryName] = useState("");
  const [isAddingNursery, setIsAddingNursery] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回読み込み時にLocalStorageからデータを取得
  useEffect(() => {
    const savedData = localStorage.getItem("nurseryGuidanceData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setNurseries(parsed);
      if (parsed.length > 0) {
        setSelectedNurseryId(parsed[0].id);
      }
    } else {
      setNurseries(defaultData);
      setSelectedNurseryId(defaultData[0].id);
      localStorage.setItem("nurseryGuidanceData", JSON.stringify(defaultData));
    }
    setIsLoaded(true);
  }, []);

  // nurseriesが更新されるたびにLocalStorageを更新
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("nurseryGuidanceData", JSON.stringify(nurseries));
    }
  }, [nurseries, isLoaded]);

  const selectedNursery = nurseries.find(n => n.id === selectedNurseryId);

  // 保育園の追加
  const handleAddNursery = (e) => {
    e.preventDefault();
    if (!newNurseryName.trim()) return;
    
    const newId = Date.now().toString();
    const newNursery = {
      id: newId,
      name: newNurseryName.trim(),
      checklist: []
    };
    
    setNurseries([...nurseries, newNursery]);
    setSelectedNurseryId(newId);
    setNewNurseryName("");
    setIsAddingNursery(false);
  };

  // 保育園の削除
  const handleDeleteNursery = (id) => {
    if(confirm("本当にこの保育園を削除しますか？")) {
      const newNurseries = nurseries.filter(n => n.id !== id);
      setNurseries(newNurseries);
      if(selectedNurseryId === id) {
        setSelectedNurseryId(newNurseries.length > 0 ? newNurseries[0].id : "");
      }
    }
  };

  // チェック項目のON/OFF
  const handleToggleCheck = (itemId) => {
    setNurseries(nurseries.map(nursery => {
      if (nursery.id === selectedNurseryId) {
        return {
          ...nursery,
          checklist: nursery.checklist.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return nursery;
    }));
  };

  // チェック項目の追加
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    setNurseries(nurseries.map(nursery => {
      if (nursery.id === selectedNurseryId) {
        return {
          ...nursery,
          checklist: [
            ...nursery.checklist,
            { id: Date.now().toString(), text: newItemText.trim(), completed: false }
          ]
        };
      }
      return nursery;
    }));
    setNewItemText("");
    setIsAddingItem(false);
  };

  // チェック項目の削除
  const handleDeleteItem = (itemId) => {
    setNurseries(nurseries.map(nursery => {
      if (nursery.id === selectedNurseryId) {
        return {
          ...nursery,
          checklist: nursery.checklist.filter(item => item.id !== itemId)
        };
      }
      return nursery;
    }));
  }

  if (!isLoaded) return <div className="p-8 text-center text-gray-500">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            保育園案内チェック
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nursery Selector */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label htmlFor="nursery-select" className="block text-sm font-medium text-gray-700 mb-1.5">
                対象の保育園を選択
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="nursery-select"
                  className="block w-full rounded-md border-gray-300 border py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base bg-gray-50"
                  value={selectedNurseryId}
                  onChange={(e) => setSelectedNurseryId(e.target.value)}
                >
                  {nurseries.length === 0 && <option value="">登録なし</option>}
                  {nurseries.map((nursery) => (
                    <option key={nursery.id} value={nursery.id}>
                      {nursery.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsAddingNursery(!isAddingNursery)}
                  className="inline-flex items-center p-2.5 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  title="保育園を追加"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>
            
            {nurseries.length > 0 && (
               <div className="mt-2 sm:mt-0 pt-1 sm:pt-6 flex justify-end">
                 <button onClick={() => handleDeleteNursery(selectedNurseryId)} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 p-2 transition-colors">
                   <TrashIcon /> <span className="sm:inline">削除</span>
                 </button>
               </div>
            )}
          </div>

          {isAddingNursery && (
            <form onSubmit={handleAddNursery} className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex flex-col sm:flex-row items-end gap-3 animate-fade-in-down">
              <div className="flex-1 w-full">
                <label htmlFor="new-nursery" className="block text-sm font-medium text-blue-800 mb-1">新規保育園名</label>
                <input
                  type="text"
                  id="new-nursery"
                  className="block w-full rounded-md border-gray-300 border py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例：みどり保育園"
                  value={newNurseryName}
                  onChange={(e) => setNewNurseryName(e.target.value)}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!newNurseryName.trim()}
                className="w-full sm:w-auto px-5 py-2.5 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed mt-2 sm:mt-0"
              >
                保存
              </button>
            </form>
          )}
        </section>

        {/* Checklist */}
        {selectedNursery ? (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50/80 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">案内内容チェックリスト</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                {selectedNursery.checklist.filter(i => i.completed).length} / {selectedNursery.checklist.length} 完了
              </span>
            </div>
            
            <ul className="divide-y divide-gray-100">
              {selectedNursery.checklist.length === 0 ? (
                <li className="p-8 text-center text-gray-500 text-sm">
                  チェック項目がありません。下から追加してください。
                </li>
              ) : (
                selectedNursery.checklist.map((item) => (
                  <li key={item.id} className="flex items-center p-4 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center flex-1 min-w-0 gap-4">
                      <div className="flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleCheck(item.id)}
                          className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                            item.completed 
                              ? "bg-blue-500 border-blue-500 text-white" 
                              : "border-gray-300 text-transparent hover:border-blue-400"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                      </div>
                      <div className="flex-1 min-w-0" onClick={() => handleToggleCheck(item.id)}>
                        <p className={`text-[15px] sm:text-base cursor-pointer select-none transition-all ${
                          item.completed ? "text-gray-400 line-through" : "text-gray-800"
                        }`}>
                          {item.text}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="ml-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 p-2"
                      title="削除"
                    >
                      <TrashIcon />
                    </button>
                  </li>
                ))
              )}
            </ul>

            <div className="p-5 border-t border-gray-100 bg-gray-50/50">
              {!isAddingItem ? (
                <button
                  onClick={() => setIsAddingItem(true)}
                  className="w-full py-3.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <PlusIcon />
                  新しい項目を追加
                </button>
              ) : (
                <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    className="flex-1 block w-full rounded-md border-gray-300 border py-2.5 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    placeholder="新しい案内項目を入力..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsAddingItem(false)}
                      className="px-5 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={!newItemText.trim()}
                      className="px-5 py-2.5 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                    >
                      追加
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <h3 className="text-lg font-medium text-gray-900">保育園が選択されていません</h3>
            <p className="mt-2 text-sm text-gray-500">上部のメニューから対象の保育園を選択するか、<br className="hidden sm:block" />新しく追加してください。</p>
          </div>
        )}
      </main>
      
      <style>{`
        .animate-fade-in-down {
          animation: fadeInDown 0.25s ease-out;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
