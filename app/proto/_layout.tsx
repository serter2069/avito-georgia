import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { pageRegistry } from '../../constants/pageRegistry';
import type { PageGroup } from '../../constants/pageRegistry';

const WIDTHS = [
  { label: '375', value: 375 },
  { label: '430', value: 430 },
  { label: '768', value: 768 },
  { label: 'full', value: 0 },
];

const GROUPS: PageGroup[] = ['Design'];

// localStorage helpers (web only)
function loadBool(key: string, fallback: boolean): boolean {
  if (Platform.OS !== 'web') return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === 'true';
  } catch { return fallback; }
}

function saveBool(key: string, val: boolean) {
  if (Platform.OS !== 'web') return;
  try { localStorage.setItem(key, String(val)); } catch {}
}

function loadComment(pageId: string): string {
  if (Platform.OS !== 'web') return '';
  try { return localStorage.getItem(`proto-comment-${pageId}`) || ''; } catch { return ''; }
}

function saveComment(pageId: string, val: string) {
  if (Platform.OS !== 'web') return;
  try { localStorage.setItem(`proto-comment-${pageId}`, val); } catch {}
}

// Comment input per page
function PageComment({ pageId }: { pageId: string }) {
  const [value, setValue] = useState(() => loadComment(pageId));

  const handleChange = (text: string) => {
    setValue(text);
    saveComment(pageId, text);
  };

  return (
    <TextInput
      value={value}
      onChangeText={handleChange}
      placeholder="note..."
      placeholderTextColor="#adb5bd"
      style={{
        fontSize: 11,
        color: '#868e96',
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#dee2e6',
        paddingVertical: 2,
        paddingHorizontal: 0,
        marginLeft: 10,
        marginRight: 4,
        marginBottom: 2,
        // @ts-ignore web
        outlineStyle: 'none',
      }}
    />
  );
}

export default function ProtoLayout() {
  const [previewWidth, setPreviewWidth] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(() => loadBool('proto-sidebar-open', true));
  const [copied, setCopied] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [handleHover, setHandleHover] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<View>(null);

  if (Platform.OS !== 'web') {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  // Sidebar toggle persist
  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    saveBool('proto-sidebar-open', next);
  };

  // Drag resize logic
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      // sidebar width when open = 220, drag handle = 4
      const sidebarW = sidebarOpen ? 220 : 0;
      const toggleBtnW = sidebarOpen ? 0 : 32;
      const available = window.innerWidth - sidebarW - toggleBtnW - 4; // 4 = handle
      const contentStart = sidebarW + toggleBtnW + 4;
      const mouseInContent = e.clientX - contentStart;
      const maxW = Math.floor(available * 0.95);
      const clamped = Math.max(280, Math.min(maxW, mouseInContent));
      // If dragged to near max, snap to full
      if (clamped >= maxW - 20) {
        setPreviewWidth(0);
      } else {
        setPreviewWidth(clamped);
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, sidebarOpen]);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const contentWidth = previewWidth === 0 ? '100%' : previewWidth;
  const activePreset = WIDTHS.find(w => w.value === previewWidth);

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#ffffff' }}>
      {/* Sidebar toggle button when closed */}
      {!sidebarOpen && (
        <Pressable
          onPress={toggleSidebar}
          style={{
            width: 32,
            backgroundColor: '#f8f9fa',
            borderRightWidth: 1,
            borderColor: '#e9ecef',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 10,
          }}
        >
          <Text style={{ fontSize: 18, color: '#495057' }}>☰</Text>
        </Pressable>
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <View style={{ width: 220, borderRightWidth: 1, borderColor: '#e9ecef', backgroundColor: '#f8f9fa' }}>
          {/* Toggle button */}
          <Pressable
            onPress={toggleSidebar}
            style={{
              padding: 8,
              borderBottomWidth: 1,
              borderColor: '#e9ecef',
              alignItems: 'flex-start',
            }}
          >
            <Text style={{ fontSize: 16, color: '#495057' }}>✕</Text>
          </Pressable>

          {/* Page list */}
          <ScrollView style={{ flex: 1 }}>
            {GROUPS.map(group => {
              const pages = pageRegistry.filter(p => p.group === group);
              if (!pages.length) return null;
              return (
                <View key={group}>
                  <Text style={{
                    color: '#868e96',
                    fontSize: 10,
                    fontWeight: '700',
                    paddingHorizontal: 10,
                    paddingTop: 10,
                    paddingBottom: 4,
                    letterSpacing: 0.5,
                  }}>
                    {group.toUpperCase()}
                  </Text>
                  {pages.map(page => {
                    const isActive = pathname.includes(page.id);
                    return (
                      <View key={page.id}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingRight: 4 }}>
                          <Pressable
                            onPress={() => router.push(`/proto/states/${page.id}` as any)}
                            style={{ flex: 1, paddingVertical: 5 }}
                          >
                            <Text style={{
                              color: isActive ? '#1971c2' : '#495057',
                              fontSize: 12,
                              fontFamily: 'monospace',
                              fontWeight: isActive ? '600' : '400',
                            }}>{page.id}</Text>
                          </Pressable>
                          <Pressable onPress={() => handleCopy(page.id)} style={{ padding: 4 }}>
                            <Text style={{ fontSize: 10, color: copied === page.id ? '#22c55e' : '#adb5bd' }}>
                              {copied === page.id ? '✓' : '⎘'}
                            </Text>
                          </Pressable>
                        </View>
                        <PageComment pageId={page.id} />
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Drag handle */}
      <Pressable
        onPressIn={() => setIsDragging(true)}
        // @ts-ignore web events
        onMouseDown={() => setIsDragging(true)}
        onHoverIn={() => setHandleHover(true)}
        onHoverOut={() => setHandleHover(false)}
        style={{
          width: 4,
          backgroundColor: isDragging || handleHover ? '#74c0fc' : '#dee2e6',
          // @ts-ignore
          cursor: 'col-resize',
        }}
      />

      {/* Content area */}
      <View style={{ flex: 1, backgroundColor: '#ffffff' }} ref={containerRef}>
        {/* Top bar with presets and width indicator */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: '#f1f3f5',
          borderBottomWidth: 1,
          borderColor: '#dee2e6',
        }}>
          {WIDTHS.map(w => (
            <Pressable
              key={w.label}
              onPress={() => setPreviewWidth(w.value)}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: previewWidth === w.value ? '#1971c2' : '#e9ecef',
                borderRadius: 4,
              }}
            >
              <Text style={{
                color: previewWidth === w.value ? '#fff' : '#495057',
                fontSize: 11,
                fontFamily: 'monospace',
              }}>{w.label}</Text>
            </Pressable>
          ))}
          <Text style={{
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#868e96',
            marginLeft: 8,
          }}>
            {previewWidth === 0 ? 'full' : `${previewWidth}px`}
          </Text>
        </View>

        {/* Page content */}
        <View style={{ flex: 1 }}>
          <View style={{ width: contentWidth, flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </View>
      </View>
    </View>
  );
}
