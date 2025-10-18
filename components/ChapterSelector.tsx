import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Chapter } from "@/types";

type ChapterSelectorProps = {
  chapters: Chapter[];
  selectedChapterId?: string;
  onSelect: (chapterId: string) => void;
  triggerLabel?: string;
};

const ChapterSelector = ({
  chapters,
  selectedChapterId,
  onSelect,
  triggerLabel = "Choose a chapter",
}: ChapterSelectorProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === selectedChapterId),
    [chapters, selectedChapterId],
  );

  const filteredChapters = useMemo(() => {
    if (!searchTerm.trim()) {
      return chapters;
    }

    const term = searchTerm.toLowerCase();
    return chapters.filter(
      (chapter) =>
        chapter.slug.toLowerCase().includes(term) ||
        chapter.title.toLowerCase().includes(term),
    );
  }, [chapters, searchTerm]);

  const closeModal = () => {
    setModalVisible(false);
    setSearchTerm("");
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        className="rounded-xl border border-black/10 bg-white px-4 py-3"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-xs font-semibold uppercase text-black/60">
          {triggerLabel}
        </Text>
        {selectedChapter ? (
          <View className="mt-1.5">
            <Text className="text-lg font-semibold text-black">
              {selectedChapter.slug}
            </Text>
            <Text className="text-sm text-black/70">
              {selectedChapter.title}
            </Text>
          </View>
        ) : (
          <Text className="mt-1.5 text-sm text-black/50">
            Select a chapter to get started
          </Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity
            activeOpacity={1}
            className="flex-1 bg-black/40"
            onPress={closeModal}
          />
          <View className="max-h-[70%] rounded-t-3xl bg-white px-4 pt-3 pb-6">
            <View className="mb-4 h-1.5 w-16 self-center rounded-full bg-black/10" />
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-black">
                Select a Chapter
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={22} color="#000" />
              </TouchableOpacity>
            </View>
            <View className="mb-4 flex-row items-center rounded-xl border border-black/10 bg-black/5 px-3">
              <Ionicons name="search" size={16} color="#111" />
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search chapters"
                placeholderTextColor="#555"
                className="ml-2 flex-1 py-2 text-[15px] text-black"
              />
            </View>

            <FlatList
              data={filteredChapters}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = item.id === selectedChapterId;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item.id);
                      closeModal();
                    }}
                    activeOpacity={0.8}
                    className="mb-2 rounded-2xl border border-black/10 bg-white px-4 py-3"
                    style={{
                      borderColor: isSelected ? item.colorTag : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-black">
                          {item.slug}
                        </Text>
                        <Text className="text-sm text-black/70">
                          {item.title}
                        </Text>
                      </View>
                      <View
                        className="h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: item.colorTag }}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color="#fff"
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={() => (
                <View className="items-center justify-center py-10">
                  <Ionicons name="alert-circle-outline" size={24} color="#999" />
                  <Text className="mt-2 text-sm text-black/60">
                    No chapters found. Try a different search.
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ChapterSelector;
