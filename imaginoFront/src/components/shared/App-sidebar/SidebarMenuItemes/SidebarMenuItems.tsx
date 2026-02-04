import { Checkbox } from '@/components/ui/checkbox';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import sidebarItensDummyData from '@/utils/SidebarDummyData';
import { Label } from '@radix-ui/react-label';

export default function SidebarMenuItemsDummyData() {
  return (
    <>
      {Object.entries(sidebarItensDummyData).map(([sectionName, items]) => (
        <div key={sectionName}>
          {/* Section Title */}
          <h1 className="text-3xl ps-3 capitalize">{sectionName.replace(/([A-Z])/g, ' $1')}</h1>

          {/* Section Items */}
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <div>
                  <Checkbox id={item.name} />

                  <Label htmlFor={item.name}>
                    <span>{item.name}</span>
                    <span className="text-neutral-500"> ({item.count})</span>
                  </Label>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>
      ))}
    </>
  );
}
