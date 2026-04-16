import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../BottomNav';
import ProtoImage from '../proto/ProtoPlaceholderImage';

// ─── Map canvas ───────────────────────────────────────────────────────────────
const MAP_W = 375;
const MAP_H = 480;

const STREETS_H = [
  { y: 80,  w: 10 }, { y: 160, w: 6 }, { y: 245, w: 10 }, { y: 330, w: 6 }, { y: 405, w: 4 },
];
const STREETS_V = [
  { x: 70,  w: 6 }, { x: 160, w: 10 }, { x: 255, w: 6 }, { x: 330, w: 4 },
];
const BLOCKS = [
  { l:72,  t:82,  r:158, b:158 }, { l:162, t:82,  r:253, b:158 }, { l:257, t:82,  r:328, b:158 },
  { l:332, t:82,  r:MAP_W, b:158 }, { l:72,  t:162, r:158, b:243 }, { l:162, t:162, r:253, b:243 },
  { l:257, t:162, r:328, b:243 }, { l:72,  t:247, r:158, b:328 }, { l:257, t:247, r:328, b:328 },
  { l:332, t:247, r:MAP_W, b:328 }, { l:72, t:332, r:158, b:403 }, { l:162, t:332, r:253, b:403 },
  { l:257, t:332, r:328, b:403 },
];
const LABELS = [
  { text:'пр. Руставели',    x:5,   y:64  },
  { text:'ул. Агмашенебели', x:5,   y:148 },
  { text:'пр. Костава',      x:5,   y:230 },
  { text:'пр. Чавчавадзе',   x:5,   y:318 },
  { text:'Парк',             x:188, y:283 },
];

// ─── Lat/lng → canvas pixel projection ────────────────────────────────────────
// Canvas covers approximate Tbilisi bounding box
const GEO_BOUNDS = { latMin: 41.66, latMax: 41.77, lngMin: 44.74, lngMax: 44.87 };

function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - GEO_BOUNDS.lngMin) / (GEO_BOUNDS.lngMax - GEO_BOUNDS.lngMin)) * MAP_W;
  const y = ((GEO_BOUNDS.latMax - lat) / (GEO_BOUNDS.latMax - GEO_BOUNDS.latMin)) * MAP_H;
  return {
    x: Math.max(20, Math.min(MAP_W - 20, Math.round(x))),
    y: Math.max(20, Math.min(MAP_H - 20, Math.round(y))),
  };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
interface ML {
  id: number;
  x: number; y: number;
  price: string;
  title: string;
  address: string;
  seed: number;
  premium?: boolean;
  clusterId: string;
}

const FALLBACK_PINS: ML[] = [
  // Single pins
  { id:1,  x:115, y:118, price:'₾95 000',    title:'3-комн., 87м²',         address:'пр. Руставели, 22',  seed:10, premium:true, clusterId:'r22'    },
  { id:3,  x:295, y:122, price:'₾28 500',    title:'Toyota Prius 2018',      address:'ул. Сабуртало, 5',   seed:12,              clusterId:'sab5'   },
  { id:5,  x:295, y:200, price:'₾18 000',    title:'Honda Civic 2020',       address:'ул. Дидубе, 11',     seed:14,              clusterId:'did11'  },
  { id:7,  x:295, y:285, price:'₾750/мес',   title:'Студия, аренда',         address:'пр. Ваке, 3',        seed:16,              clusterId:'vake3'  },
  { id:8,  x:115, y:368, price:'₾3 200',     title:'MacBook Pro M2',         address:'пр. Чавчавадзе, 18', seed:17,              clusterId:'chav18' },
  { id:10, x:295, y:362, price:'₾120 000',   title:'4-комн. пентхаус',       address:'пр. Ваке, 7',        seed:19, premium:true, clusterId:'vake7'  },
  // Cluster A — 5 listings, пр. Руставели 15
  { id:11, x:205, y:118, price:'₾85 000',    title:'3-комн., 78м²',          address:'пр. Руставели, 15',  seed:20,              clusterId:'rust15' },
  { id:12, x:205, y:118, price:'₾62 000',    title:'2-комн., 55м²',          address:'пр. Руставели, 15',  seed:21,              clusterId:'rust15' },
  { id:13, x:205, y:118, price:'₾48 000',    title:'1-комн., 38м²',          address:'пр. Руставели, 15',  seed:22,              clusterId:'rust15' },
  { id:14, x:205, y:118, price:'₾1 200/мес', title:'Аренда, 2-комн.',        address:'пр. Руставели, 15',  seed:23,              clusterId:'rust15' },
  { id:15, x:205, y:118, price:'₾110 000',   title:'Пентхаус, 4-комн.',      address:'пр. Руставели, 15',  seed:24, premium:true, clusterId:'rust15' },
  // Cluster B — 3 listings, пр. Костава 8
  { id:16, x:115, y:285, price:'₾1 400/мес', title:'Офис 50м², 3 этаж',      address:'пр. Костава, 8',     seed:25,              clusterId:'kost8'  },
  { id:17, x:115, y:285, price:'₾1 100/мес', title:'Офис 35м², 1 этаж',      address:'пр. Костава, 8',     seed:26,              clusterId:'kost8'  },
  { id:18, x:115, y:285, price:'₾2 200/мес', title:'Офис 80м², 5 этаж',      address:'пр. Костава, 8',     seed:27,              clusterId:'kost8'  },
];

// ─── Convert API pins to internal ML format ───────────────────────────────────
function apiPinsToML(apiPins: any[]): ML[] {
  return apiPins.map((p, i) => {
    const coords = p.lat && p.lng ? latLngToXY(p.lat, p.lng) : { x: 100 + (i % 5) * 50, y: 100 + Math.floor(i / 5) * 60 };
    const currency = p.currency === 'GEL' ? '₾' : (p.currency ?? '₾');
    return {
      id: i + 1,
      x: coords.x,
      y: coords.y,
      price: `${currency}${Number(p.price).toLocaleString('ru-RU')}`,
      title: p.title,
      address: p.title,
      seed: (i % 20) + 10,
      clusterId: p.id ?? String(i),
    };
  });
}

// ─── Cluster logic ────────────────────────────────────────────────────────────
interface Cluster {
  clusterId: string;
  x: number; y: number;
  pins: ML[];
  isCluster: boolean;
}

function buildClusters(pins: ML[]): Cluster[] {
  const map = new Map<string, ML[]>();
  for (const p of pins) {
    const arr = map.get(p.clusterId) ?? [];
    arr.push(p);
    map.set(p.clusterId, arr);
  }
  const result: Cluster[] = [];
  map.forEach((group, clusterId) => {
    result.push({ clusterId, x: group[0].x, y: group[0].y, pins: group, isCluster: group.length > 1 });
  });
  return result;
}

// ─── Markers ──────────────────────────────────────────────────────────────────
function PricePin({ pin, active, onPress }: { pin: ML; active: boolean; onPress(): void }) {
  const bg        = active ? '#00AA6C' : pin.premium ? '#1A1A1A' : '#FFFFFF';
  const textColor = (active || pin.premium) ? '#FFFFFF' : '#1A1A1A';
  return (
    <Pressable onPress={onPress}
      style={{ position:'absolute', left: pin.x - 38, top: pin.y - 18, zIndex: active ? 30 : 10 }}>
      <View style={{
        backgroundColor: bg, borderRadius: 22, borderWidth: 1.5,
        borderColor: active ? '#00AA6C' : '#BBBBBB',
        paddingHorizontal: 9, paddingVertical: 5, minWidth: 76, alignItems:'center',
        shadowColor:'#000', shadowOffset:{width:0,height:2},
        shadowOpacity: active ? 0.3 : 0.12, shadowRadius:4, elevation: active ? 8 : 3,
      }}>
        <Text style={{ fontSize:11, fontWeight:'700', color: textColor }} numberOfLines={1}>
          {pin.price}
        </Text>
      </View>
      <View style={{
        width:0, height:0, borderLeftWidth:5, borderRightWidth:5, borderTopWidth:6,
        borderLeftColor:'transparent', borderRightColor:'transparent', borderTopColor: bg,
        alignSelf:'center', marginTop:-1,
      }}/>
    </Pressable>
  );
}

function ClusterPin({ cluster, active, onPress }: { cluster: Cluster; active: boolean; onPress(): void }) {
  const bg   = active ? '#00AA6C' : '#1976D2';
  const ring = active ? 'rgba(0,170,108,0.2)' : 'rgba(25,118,210,0.18)';
  const size = cluster.pins.length >= 5 ? 48 : 42;
  return (
    <Pressable onPress={onPress}
      style={{ position:'absolute', left: cluster.x - (size+8)/2, top: cluster.y - (size+8)/2 - 4, zIndex: active ? 30 : 15 }}>
      <View style={{
        width: size+8, height: size+8, borderRadius: (size+8)/2,
        backgroundColor: ring, alignItems:'center', justifyContent:'center',
      }}>
        <View style={{
          width: size, height: size, borderRadius: size/2,
          backgroundColor: bg, alignItems:'center', justifyContent:'center',
          borderWidth: 2.5, borderColor: '#FFFFFF',
          shadowColor:'#000', shadowOffset:{width:0,height:3},
          shadowOpacity:0.25, shadowRadius:6, elevation:8,
        }}>
          <Text style={{ fontSize: cluster.pins.length >= 10 ? 13 : 15, fontWeight:'800', color:'#FFFFFF' }}>
            {cluster.pins.length}
          </Text>
        </View>
      </View>
      <View style={{
        width:0, height:0, borderLeftWidth:5, borderRightWidth:5, borderTopWidth:6,
        borderLeftColor:'transparent', borderRightColor:'transparent', borderTopColor: bg,
        alignSelf:'center', marginTop:-3,
      }}/>
    </Pressable>
  );
}

// ─── Map background ───────────────────────────────────────────────────────────
function MapBg({ clusters, activeId, onPin, height }: {
  clusters: Cluster[]; activeId: string|null; onPin(id:string): void; height: number;
}) {
  return (
    <View style={{ width:'100%', height, backgroundColor:'#E8EDF0', overflow:'hidden', position:'relative' }}>
      {BLOCKS.map((b,i) => (
        <View key={i} style={{ position:'absolute', left:b.l, top:b.t, width:b.r-b.l, height:b.b-b.t, backgroundColor:'#D8DFE3' }}/>
      ))}
      <View style={{ position:'absolute', left:162, top:247, width:91, height:81, backgroundColor:'#C8E6C9' }}/>
      <View style={{ position:'absolute', left:170, top:255, width:75, height:65, backgroundColor:'#A5D6A7', borderRadius:6 }}/>
      {STREETS_H.map((s,i) => (
        <View key={i} style={{ position:'absolute', left:0, top:s.y-s.w/2, width:MAP_W, height:s.w, backgroundColor:'#FFFFFF' }}/>
      ))}
      {STREETS_V.map((s,i) => (
        <View key={i} style={{ position:'absolute', left:s.x-s.w/2, top:0, width:s.w, height:MAP_H, backgroundColor:'#FFFFFF' }}/>
      ))}
      {LABELS.map((l,i) => (
        <Text key={i} style={{ position:'absolute', left:l.x, top:l.y, fontSize:8, color:'#8A9BA8', fontWeight:'500' }}>
          {l.text}
        </Text>
      ))}
      {clusters.map(c => c.isCluster
        ? <ClusterPin key={c.clusterId} cluster={c} active={activeId===c.clusterId} onPress={() => onPin(c.clusterId)}/>
        : <PricePin   key={c.clusterId} pin={c.pins[0]} active={activeId===c.clusterId} onPress={() => onPin(c.clusterId)}/>
      )}
    </View>
  );
}

// ─── Listing row card ─────────────────────────────────────────────────────────
function ListingRow({ pin, onPress }: { pin: ML; onPress(): void }) {
  return (
    <Pressable onPress={onPress}
      className="flex-row bg-white rounded-xl overflow-hidden border border-[#EFEFEF] mb-2">
      <ProtoImage seed={pin.seed} width={84} height={76}/>
      <View className="flex-1 px-3 py-2 justify-between">
        <Text className="text-[15px] font-bold text-[#1A1A1A]">{pin.price}</Text>
        <Text className="text-[13px] text-[#1A1A1A]" numberOfLines={1}>{pin.title}</Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={11} color="#9E9E9E"/>
          <Text className="text-[11px] text-[#9E9E9E]">{pin.address}</Text>
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

// ─── Mobile ───────────────────────────────────────────────────────────────────
export function MapMobile({ pins: apiPins }: { pins?: any[] }) {
  const { width } = useWindowDimensions();
  const [activeId, setActiveId] = useState<string|null>(null);

  const PINS = apiPins && apiPins.length > 0 ? apiPinsToML(apiPins) : FALLBACK_PINS;
  const clusters    = buildClusters(PINS);
  const activeCluster = activeId ? clusters.find(c => c.clusterId === activeId) : null;
  const toggle      = (id: string) => setActiveId(prev => prev === id ? null : id);

  return (
    <View className="bg-white">
      <View className="flex-row items-center px-4 py-3 border-b border-[#EFEFEF] gap-3">
        <Pressable className="w-9 h-9 rounded-full bg-[#F5F5F5] items-center justify-center">
          <Ionicons name="chevron-back" size={22} color="#1A1A1A"/>
        </Pressable>
        <Text className="flex-1 text-[17px] font-semibold text-[#1A1A1A]">Карта</Text>
        <Pressable className="w-9 h-9 rounded-full bg-[#F5F5F5] items-center justify-center">
          <Ionicons name="options-outline" size={20} color="#1A1A1A"/>
        </Pressable>
      </View>

      <View style={{ position:'relative' }}>
        <MapBg clusters={clusters} activeId={activeId} onPin={toggle} height={350}/>

        <View className="absolute top-3 left-3 bg-white rounded-full px-3 py-1.5 border border-[#E0E0E0]"
          style={{ shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.1, shadowRadius:3, elevation:2 }}>
          <Text className="text-[12px] font-semibold text-[#1A1A1A]">{PINS.length} объявлений</Text>
        </View>

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

      <View className="bg-[#F5F5F5] px-4 pt-3 pb-4" style={{ minHeight: 200 }}>
        <View className="w-9 h-1 rounded-full bg-[#D0D0D0] self-center mb-3"/>

        {activeCluster ? (
          <View>
            <View className="flex-row items-center justify-between mb-2.5">
              <View>
                <Text className="text-[14px] font-semibold text-[#1A1A1A]">
                  {activeCluster.isCluster ? `${activeCluster.pins.length} объявлений` : 'Объявление'}
                </Text>
                {activeCluster.isCluster && (
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Ionicons name="location-outline" size={11} color="#9E9E9E"/>
                    <Text className="text-[11px] text-[#9E9E9E]">{activeCluster.pins[0].address}</Text>
                  </View>
                )}
              </View>
              <Pressable onPress={() => setActiveId(null)}>
                <Ionicons name="close-circle" size={22} color="#BBBBBB"/>
              </Pressable>
            </View>

            {activeCluster.isCluster ? (
              <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator={false}>
                {activeCluster.pins.map(p => <ListingRow key={p.id} pin={p} onPress={() => {}}/>)}
              </ScrollView>
            ) : (
              <View>
                <ListingRow pin={activeCluster.pins[0]} onPress={() => {}}/>
                <Pressable className="bg-[#00AA6C] rounded-xl py-3 items-center mt-1">
                  <Text className="text-white font-semibold text-[14px]">Открыть объявление</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          <View>
            <Text className="text-[13px] text-[#9E9E9E] mb-2.5">Нажмите на маркер или кластер</Text>
            {PINS.slice(0,3).map(p => <ListingRow key={p.id} pin={p} onPress={() => toggle(p.clusterId)}/>)}
          </View>
        )}
      </View>

      {width < 640 && <BottomNav active="browse"/>}
    </View>
  );
}

// ─── Desktop ──────────────────────────────────────────────────────────────────
export function MapDesktop({ pins: apiPins }: { pins?: any[] }) {
  const [activeId, setActiveId] = useState<string|null>(null);

  const PINS = apiPins && apiPins.length > 0 ? apiPinsToML(apiPins) : FALLBACK_PINS;
  const clusters      = buildClusters(PINS);
  const activeCluster = activeId ? clusters.find(c => c.clusterId === activeId) : null;
  const toggle        = (id: string) => setActiveId(prev => prev === id ? null : id);

  return (
    <View className="flex-row bg-white rounded-xl overflow-hidden border border-[#EFEFEF]"
      style={{ height:580 }}>

      <View className="border-r border-[#EFEFEF]" style={{ width:320 }}>
        <View className="px-4 py-3 border-b border-[#EFEFEF]">
          <Text className="text-[15px] font-semibold text-[#1A1A1A]">Карта объявлений</Text>
          <Text className="text-[12px] text-[#9E9E9E] mt-0.5">{PINS.length} объявлений</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding:12, paddingBottom:24 }}>
          {PINS.map(p => (
            <View key={p.id} style={{ opacity: activeId && activeId !== p.clusterId ? 0.5 : 1 }}>
              <ListingRow pin={p} onPress={() => toggle(p.clusterId)}/>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className="flex-1 relative">
        <MapBg clusters={clusters} activeId={activeId} onPin={toggle} height={580}/>

        <View className="absolute right-4 bottom-4 bg-white rounded-xl border border-[#E0E0E0] overflow-hidden"
          style={{ shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3 }}>
          <Pressable className="w-10 h-10 items-center justify-center border-b border-[#EFEFEF]">
            <Ionicons name="add" size={20} color="#1A1A1A"/>
          </Pressable>
          <Pressable className="w-10 h-10 items-center justify-center">
            <Ionicons name="remove" size={20} color="#1A1A1A"/>
          </Pressable>
        </View>

        {activeCluster && (
          <View className="absolute bottom-4 left-4 bg-white rounded-2xl overflow-hidden border border-[#EFEFEF]"
            style={{ width:280, maxHeight:360, shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.15, shadowRadius:12, elevation:8 }}>

            {activeCluster.isCluster ? (
              <View>
                <View className="px-4 pt-4 pb-2.5 border-b border-[#EFEFEF] flex-row items-start justify-between">
                  <View>
                    <Text className="text-[15px] font-bold text-[#1A1A1A]">
                      {activeCluster.pins.length} объявлений
                    </Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <Ionicons name="location-outline" size={11} color="#9E9E9E"/>
                      <Text className="text-[11px] text-[#9E9E9E]">{activeCluster.pins[0].address}</Text>
                    </View>
                  </View>
                  <Pressable onPress={() => setActiveId(null)}
                    className="w-7 h-7 rounded-full bg-[#F5F5F5] items-center justify-center mt-0.5">
                    <Ionicons name="close" size={15} color="#6B6B6B"/>
                  </Pressable>
                </View>
                <ScrollView style={{ maxHeight:280 }} contentContainerStyle={{ padding:12 }}>
                  {activeCluster.pins.map(p => <ListingRow key={p.id} pin={p} onPress={() => {}}/>)}
                </ScrollView>
              </View>
            ) : (
              <View>
                <ProtoImage seed={activeCluster.pins[0].seed} width={280} height={140}/>
                <View className="p-3">
                  <Text className="text-[16px] font-bold text-[#1A1A1A]">{activeCluster.pins[0].price}</Text>
                  <Text className="text-[13px] text-[#1A1A1A] mt-0.5">{activeCluster.pins[0].title}</Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <Ionicons name="location-outline" size={12} color="#9E9E9E"/>
                    <Text className="text-[11px] text-[#9E9E9E]">{activeCluster.pins[0].address}</Text>
                  </View>
                  <View className="flex-row gap-2 mt-2.5">
                    <Pressable className="flex-1 bg-[#00AA6C] rounded-lg py-2 items-center">
                      <Text className="text-white text-[13px] font-semibold">Открыть</Text>
                    </Pressable>
                    <Pressable onPress={() => setActiveId(null)}
                      className="w-9 h-9 rounded-lg bg-[#F5F5F5] items-center justify-center">
                      <Ionicons name="close" size={18} color="#6B6B6B"/>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function MapView({ pins }: { pins?: any[] }) {
  return <MapMobile pins={pins} />;
}
