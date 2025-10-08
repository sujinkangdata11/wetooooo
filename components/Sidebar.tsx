import React from 'react';

type MenuKey = 'input' | 'scene' | 'results' | 'api';

interface MenuItem {
  id: MenuKey;
  label: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'input', label: '캐릭터 생성' },
  { id: 'scene', label: '씬 생성' },
  { id: 'results', label: '웹툰 생성' },
  { id: 'api', label: 'API 입력' },
];

interface SidebarProps {
  activeTab: MenuKey;
  onSelect: (tab: MenuKey) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelect }) => {
  return (
    <aside className="w-full lg:w-72 lg:min-h-screen lg:bg-[#f5efe3]/70 lg:border-r lg:border-[#efe3d1]">
      <div className="px-4 py-6 lg:px-6 lg:py-10">
        <nav className="space-y-5 lg:sticky lg:top-16">
          <div>
            <h2 className="text-lg font-semibold text-[#8d6851]">메뉴</h2>
          </div>
          <ul className="mt-4 space-y-2.5">
            {MENU_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`group w-full text-left px-4 py-3 rounded-2xl border transition duration-200 ${
                    activeTab === item.id
                      ? 'bg-white text-[#c06d52] border-[#e7cdb2]'
                      : 'bg-[#f5efe3] border-[#efe3d1] hover:border-[#e7cdb2] hover:bg-white'
                  }`}
                  aria-label={`${item.label} 섹션으로 이동`}
                >
                  <span
                    className={`block text-sm font-medium ${
                      activeTab === item.id ? 'text-[#c06d52]' : 'text-[#5f4c42] group-hover:text-[#c06d52]'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
