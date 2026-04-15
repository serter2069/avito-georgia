import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import BottomNav from '../BottomNav';
import ProtoImage from '../ProtoPlaceholderImage';

// ─── Map canvas constants ─────────────────────────────────────────────────────
const MAP_W = 375;
const MAP_H = 480;

// Streets: horiz and vert lines with thickness
const STREETS_H = [
  { y: 80,  w: 10 }, // пр. Руставели
  { y: 160, w: 6  }, // ул. Агмашенебели
  { y: 245, w: 10 }, // пр. Костава
  { y: 330, w: 6  }, // пр. Чавчавадзе
  { y: 405, w: 4  },
];
const STREETS_V = [
  { x: 70,  w: 6  },
  { x: 160, w: 10 }, // пр. Плеханова
  { x: 255, w: 6  },
  { x: 330, w: 4  },
];

// City blocks between streets (fill gaps)
const BLOCKS = [
  { l: 72,  t: 82,  r: 158, b: 158 },
  { l: 162, t: 82,  r: 253, b: 158 },
  { l: 257, t: 82,  r: 328, b: 158 },
  { l: 332, t: 82,  r: MAP_W, b: 158 },
  { l: 72,  t: 162, r: 158, b: 243 },
  { l: 162, t: 162, r: 253, b: 243 },
  { l: 257, t: 162, r: 328, b: 243 },
  { l: 72,  t: 247, r: 158, b: 328 },
  // park at 162-253 y:247-328
  { l: 257, t: 247, r: 328, b: 328 },
  { l: 332, t: 247, r: MAP_W, b: 328 },
  { l: 72,  t: 332, r: 158, b: 403 },
  { l: 162, t: 332, r: 253, b: 403 },
  { l: 257, t: 332, r: 328, b: 403 },
];

const LABELS = [
  { text: 'пр. Руставели',    x: 5,  y: 64  },
  { text: 'ул. Агмашенебели', x: 5,  y: 148 },
  { text: 'пр. Костава',      x: 5,  y: 230 },
  { text: 'пр. Чавчавадзе',   x: 5,  y: 318 },
  { text: 'Парк',             x: 188, y: 283 },
];

// ─── Listings with map coordinates ───────────────────────────────────────────
type Category = 'realty' | 'auto' | 'other';

interface ML {
  id: number; x: number; y: number;
  price: string; title: string; area: string;
  seed: number; cat: Category; premium?: boolean;
}

const PINS: ML[] = [
  { id:1,  x:115, y:118, price:'₾95 000',    title:'3-комн., Руставели',     area:'Руставели',    seed:10, cat:'realty', premium:true  },
  { id:2,  x:205, y:110, price:'₾62 000',    title:'2-комн., 55м²',          area:'Руставели',    seed:11, cat:'realty'                 },
  { id:3,  x:295, y:122, price:'₾28 500',    title:'Toyota Prius 2018',      area:'Сабуртало',    seed:12, cat:'auto'                   },
  { id:4,  x:115, y:200, price:'₾45 000',    title:'1-комн., новострой',     area:'Агмашенебели', seed:13, cat:'realty'                 },
  { id:5,  x:295, y:200, price:'₾18 000',    title:'Honda Civic 2020',       area:'Дидубе',       seed:14, cat:'auto'                   },
  { id:6,  x:115, y:285, price:'₾1 200/мес', title:'Офис 40м², аренда',      area:'Костава',      seed:15, cat:'realty'                 },
  { id:7,  x:295, y:285, price:'₾750/мес',   title:'Студия, аренда',         area:'Ваке',         seed:16, cat:'realty'                 },
  { id:8,  x:115, y:368, price:'₾3 200',     title:'MacBook Pro M2',         area:'Чавчавадзе',   seed:17, cat:'other'                  },
  { id:9,  x:205, y:368, price:'₾850',       title:'Диван угловой',          area:'Чавчавадзе',   seed:18, cat:'other'                  },
  { id:10, x:295, y:362, price:'₾120 000',   title:'4-комн. пентхаус',       area:'Ваке',         seed:19, cat:'realty', premium:true   },
];

// ─── Price bubble marker ──────────────────────────────────────────────────────
function PricePin({ pin, active, onPress }: { pin: ML; active: boolean; onPress(): void }) {
  const bg        = active ? '#00AA6C' : pin.premium ? '#1A1A1A' : '#FFFFFF';
  const textColor = (active || pin.premium) ? '#FFFFFF' : '#1A1A1A';
  const border    = active ? '#00AA6C' : '#BBBBBB';

  return (
    <Pressable
      onPress={onPress}
      style={{ position:'absolute', left: pin.x - 38, top: pin.y - 18, zIndex: active ? 30 : 10 }}
    >
      <View style={{
        backgroundColor: bg, borderRadius: 22,
        borderWidth: 1.5, borderColor: border,
        paddingHorizontal: 9, paddingVertical: 5,
        shadowColor:'#000', shadowOffset:{width:0,height:2},
        shadowOpacity: active ? 0.3 : 0.12, shadowRadius:4, elevation: active ? 8 : 3,
        minWidth: 76, alignItems:'center',
      }}>
        <Text style={{ fontSize:11, fontWeight:'700', color: textColor }} numberOfLines={1}>
          {pin.price}
        </Text>
      </View>
      {/* tail */}
      <View style={{
        width:0, height:0,
        borderLeftWidth:5, borderRightWidth:5, borderTopWidth:6,
        borderLeftColor:'transparent', borderRightColor:'transparent', borderTopColor: bg,
        alignSelf:'center', marginTop:-1,
      }}/>
    </Pressable>
  );
}

// ─── Drawn map background ─────────────────────────────────────────────────────
function MapBg({ activeId, pins, onPin, height }: {
  activeId: number|null; pins: ML[]; onPin(id:number): void; height: number;
}) {
  return (
    <View style={{ width:'100%', height, backgroundColor:'#E8EDF0', overflow:'hidden', position:'relative' }}>

      {/* Blocks */}
      {BLOCKS.map((b,i) => (
        <View key={i} style={{ position:'absolute', left:b.l, top:b.t, width:b.r-b.l, height:b.b-b.t, backgroundColor:'#D8DFE3' }}/>
      ))}

      {/* Park */}
      <View style={{ position:'absolute', left:162, top:247, width:91, height:81, backgroundColor:'#C8E6C9' }}/>
      <View style={{ position:'absolute', left:170, top:255, width:75, height:65, backgroundColor:'#A5D6A7', borderRadius:6 }}/>

      {/* Horizontal streets */}
      {STREETS_H.map((s,i) => (
        <View key={i} style={{ position:'absolute', left:0, top: s.y - s.w/2, width:MAP_W, height:s.w, backgroundColor:'#FFFFFF' }}/>
      ))}
      {/* Vertical streets */}
      {STREETS_V.map((s,i) => (
        <View key={i} style={{ position:'absolute', left: s.x - s.w/2, top:0, width:s.w, height: MAP_H, backgroundColor:'#FFFFFF' }}/>
      ))}

      {/* Street labels */}
      {LABELS.map((l,i) => (
        <Text key={i} style={{ position:'absolute', left:l.x, top:l.y, fontSize:8, color:'#8A9BA8', fontWeight:'500' }}>
          {l.text}
        </Text>
      ))}

      {/* Price pins */}
      {pins.map(p => (
        <PricePin key={p.id} pin={p} active={activeId===p.id} onPress={() => onPin(p.id)}/>
      ))}
    </View>
  );
}

// ─── Listing row card ─────────────────────────────────────────────────────────
function ListingRow({ pin, onPress }: { pin: ML; onPress(): void }) {
  return (
    <Pressable onPress={onPress}
      className="flex-row bg-white rounded-xl overflow-hidden border border-[#EFEFEF] mb-2">
      <ProtoImage seed={pin.seed} width={84} height={76} />
      <View className="flex-1 px-3 py-2 justify-between">
        <Text className="text-[15px] font-bold text-[#1A1A1A]">{pin.price}</Text>
        <Text className="text-[13px] text-[#1A1A1A]" numberOfLines={1}>{pin.title}</Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={11} color="#9E9E9E"/>
          <Text className="text-[11px] text-[#9E9E9E]">{pin.area}</Text>
          {pin.premium && (
            <View className="ml-1 bg-[#1A1A1A] rounded px-1.5 py-0.5">
              <Text className="text-[9px] font-bold text-white">VIP</Text>
            </View>
          )}
        </View>
      </View>
      <View className="items-center justify-center pr-3">
        <Ionicons name="chevron-forward" size={18} color="#CCCCCC"/>
      </View>
    </Pressable>
  );
}

// ─── Mobile map view ──────────────────────────────────────────────────────────
function MapMobile() {
  const { width } = useWindowDimensions();
  const [active, setActive] = useState<number|null>(null);
  const [filter, setFilter] = useState<'all'|Category>('all');

  const filtered = filter === 'all' ? PINS : PINS.filter(p => p.cat === filter);
  const activePins = filtered;
  const selected = active ? PINS.find(p => p.id === active) : null;

  const toggle = (id: number) => setActive(prev => prev === id ? null : id);

  return (
    <View className="bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#EFEFEF] gap-3">
        <Pressable className="w-9 h-9 rounded-full bg-[#F5F5F5] items-center justify-center">
          <Ionicons name="chevron-back" size={22} color="#1A1A1A"/>
        </Pressable>
        <Text className="flex-1 text-[17px] font-semibold text-[#1A1A1A]">Карта</Text>
        <Pressable className="w-9 h-9 rounded-full bg-[#F5F5F5] items-center justify-center">
          <Ionicons name="options-outline" size={20} color="#1A1A1A"/>
        </Pressable>
      </View>

      {/* Filter pills */}
      <View className="flex-row gap-2 px-4 py-2.5 border-b border-[#EFEFEF]">
        {([
          { k:'all',    l:'Все'           },
          { k:'realty', l:'Недвижимость'  },
          { k:'auto',   l:'Авто'         },
          { k:'other',  l:'Прочее'       },
        ] as {k:'all'|Category; l:string}[]).map(({k,l}) => (
          <Pressable key={k} onPress={() => setFilter(k)}
            className={`rounded-full px-3.5 py-1.5 border ${filter===k ? 'bg-[#00AA6C] border-[#00AA6C]' : 'bg-white border-[#E0E0E0]'}`}>
            <Text className={`text-[12px] font-medium ${filter===k ? 'text-white' : 'text-[#6B6B6B]'}`}>{l}</Text>
          </Pressable>
        ))}
      </View>

      {/* Map */}
      <View style={{ position:'relative' }}>
        <MapBg activeId={active} pins={activePins} onPin={toggle} height={340}/>

        {/* Count badge */}
        <View className="absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 border border-[#E0E0E0]"
          style={{ shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.1, shadowRadius:3, elevation:2 }}>
          <Text className="text-[12px] font-semibold text-[#1A1A1A]">{activePins.length} объявлений</Text>
        </View>

        {/* Zoom */}
        <View className="absolute right-3 bottom-3 bg-white rounded-xl border border-[#E0E0E0] overflow-hidden"
          style={{ shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3 }}>
          <Pressable className="w-10 h-10 items-center justify-center border-b border-[#EFEFEF]">
            <Ionicons name="add" size={20} color="#1A1A1A"/>
          </Pressable>
          <Pressable className="w-10 h-10 items-center justify-center">
            <Ionicons name="remove" size={20} color="#1A1A1A"/>
          </Pressable>
        </View>
      </View>

      {/* Bottom sheet */}
      <View className="bg-[#F5F5F5] px-4 pt-3 pb-4" style={{ minHeight: 180 }}>
        <View className="w-9 h-1 rounded-full bg-[#D0D0D0] self-center mb-3"/>

        {selected ? (
          <View>
            <View className="flex-row items-center justify-between mb-2.5">
              <Text className="text-[13px] font-semibold text-[#1A1A1A]">Выбранное</Text>
              <Pressable onPress={() => setActive(null)}>
                <Ionicons name="close-circle" size={22} color="#9E9E9E"/>
              </Pressable>
            </View>
            <ListingRow pin={selected} onPress={() => {}}/>
            <Pressable className="bg-[#00AA6C] rounded-xl py-3 items-center mt-1">
              <Text className="text-white font-semibold text-[14px]">Открыть объявление</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <Text className="text-[13px] text-[#9E9E9E] mb-2.5">
              {activePins.length} объявлений · нажмите маркер
            </Text>
            {activePins.slice(0,3).map(p => (
              <ListingRow key={p.id} pin={p} onPress={() => setActive(p.id)}/>
            ))}
            {activePins.length > 3 && (
              <Pressable className="items-center py-2">
                <Text className="text-[13px] text-[#00AA6C] font-medium">
                  Ещё {activePins.length - 3} объявлений →
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {width < 640 && <BottomNav active="browse"/>}
    </View>
  );
}

// ─── Desktop split view ───────────────────────────────────────────────────────
function MapDesktop() {
  const [active, setActive] = useState<number|null>(null);
  const [filter, setFilter] = useState<'all'|Category>('all');

  const filtered = filter === 'all' ? PINS : PINS.filter(p => p.cat === filter);
  const selected = active ? PINS.find(p => p.id === active) : null;
  const toggle = (id:number) => setActive(prev => prev===id ? null : id);

  return (
    <View className="flex-row bg-white rounded-xl overflow-hidden border border-[#EFEFEF]"
      style={{ height:580 }}>

      {/* Left panel */}
      <View className="border-r border-[#EFEFEF]" style={{ width:320 }}>
        {/* Filters */}
        <View className="flex-row flex-wrap gap-2 px-4 py-3 border-b border-[#EFEFEF]">
          {([
            { k:'all',    l:'Все'          },
            { k:'realty', l:'Недвижимость' },
            { k:'auto',   l:'Авто'        },
            { k:'other',  l:'Прочее'      },
          ] as {k:'all'|Category; l:string}[]).map(({k,l}) => (
            <Pressable key={k} onPress={() => setFilter(k)}
              className={`rounded-full px-3 py-1 border ${filter===k ? 'bg-[#00AA6C] border-[#00AA6C]' : 'bg-white border-[#E0E0E0]'}`}>
              <Text className={`text-[12px] font-medium ${filter===k ? 'text-white' : 'text-[#6B6B6B]'}`}>{l}</Text>
            </Pressable>
          ))}
        </View>
        <Text className="px-4 py-2 text-[12px] text-[#9E9E9E]">{filtered.length} объявлений</Text>
        <ScrollView contentContainerStyle={{ padding:12, paddingBottom:24 }}>
          {filtered.map(p => (
            <View key={p.id} style={{ opacity: active && active!==p.id ? 0.55 : 1 }}>
              <ListingRow pin={p} onPress={() => toggle(p.id)}/>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Map panel */}
      <View className="flex-1 relative">
        <MapBg activeId={active} pins={filtered} onPin={toggle} height={580}/>

        {/* Zoom controls */}
        <View className="absolute right-4 bottom-4 bg-white rounded-xl border border-[#E0E0E0] overflow-hidden"
          style={{ shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3 }}>
          <Pressable className="w-10 h-10 items-center justify-center border-b border-[#EFEFEF]">
            <Ionicons name="add" size={20} color="#1A1A1A"/>
          </Pressable>
          <Pressable className="w-10 h-10 items-center justify-center">
            <Ionicons name="remove" size={20} color="#1A1A1A"/>
          </Pressable>
        </View>

        {/* Selected popup */}
        {selected && (
          <View className="absolute bottom-4 left-4 bg-white rounded-2xl overflow-hidden border border-[#EFEFEF]"
            style={{ width:260, shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.15, shadowRadius:12, elevation:8 }}>
            <ProtoImage seed={selected.seed} width={260} height={140}/>
            <View className="p-3">
              <Text className="text-[16px] font-bold text-[#1A1A1A]">{selected.price}</Text>
              <Text className="text-[13px] text-[#1A1A1A] mt-0.5">{selected.title}</Text>
              <View className="flex-row items-center gap-1 mt-1">
                <Ionicons name="location-outline" size={12} color="#9E9E9E"/>
                <Text className="text-[11px] text-[#9E9E9E]">{selected.area}</Text>
              </View>
              <View className="flex-row gap-2 mt-2.5">
                <Pressable className="flex-1 bg-[#00AA6C] rounded-lg py-2 items-center">
                  <Text className="text-white text-[13px] font-semibold">Открыть</Text>
                </Pressable>
                <Pressable onPress={() => setActive(null)}
                  className="w-9 h-9 rounded-lg bg-[#F5F5F5] items-center justify-center">
                  <Ionicons name="close" size={18} color="#6B6B6B"/>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function MapViewStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={{ gap: 32 }}>
      <StateSection title="MAP_VIEW / Mobile — price markers + bottom sheet">
        <MapMobile/>
      </StateSection>
      <StateSection title="MAP_VIEW / Desktop — split list + map">
        <MapDesktop/>
      </StateSection>
    </View>
  );
}
