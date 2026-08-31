import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Stack, Text } from "@/components/ui";
import { strengthenColor } from "@/utils";

import { CategorySelectorProps } from "./types";

const MAX_VISIBLE_CATEGORIES = 4;
const NO_CATEGORY_COLOR = "#e1e3e5";

export function CategorySelector({
  categories,
  type,
  value,
  onChange,
  disabled = false,
}: CategorySelectorProps) {
  const filteredCategories = categories.filter(
    (category) => category.type === type,
  );

  const selectedCategory =
    value !== null
      ? filteredCategories.find((category) => category.id === value)
      : undefined;

  const selectedIndex = selectedCategory
    ? filteredCategories.findIndex((category) => category.id === value)
    : -1;

  const selectedOutsideLimit = selectedIndex >= MAX_VISIBLE_CATEGORIES;

  const [showAll, setShowAll] = useState(selectedOutsideLimit);

  useEffect(() => {
    if (selectedOutsideLimit) {
      setShowAll(true);
    }
  }, [selectedOutsideLimit]);

  const shouldLimitCategories =
    filteredCategories.length > MAX_VISIBLE_CATEGORIES;

  const getVisibleCategories = () => {
    if (!shouldLimitCategories || showAll) {
      return filteredCategories;
    }

    if (!selectedCategory) {
      return filteredCategories.slice(0, MAX_VISIBLE_CATEGORIES);
    }

    const selectedIsVisible = filteredCategories
      .slice(0, MAX_VISIBLE_CATEGORIES)
      .some((category) => category.id === selectedCategory.id);

    if (selectedIsVisible) {
      return filteredCategories.slice(0, MAX_VISIBLE_CATEGORIES);
    }

    const categoriesWithoutSelected = filteredCategories.filter(
      (category) => category.id !== selectedCategory.id,
    );

    return [
      ...categoriesWithoutSelected.slice(0, MAX_VISIBLE_CATEGORIES - 1),
      selectedCategory,
    ];
  };

  const visibleCategories = getVisibleCategories();

  const handleToggleShowAll = () => {
    setShowAll((current) => !current);
  };

  const noCategoryDarkColor = strengthenColor(NO_CATEGORY_COLOR);

  return (
    <Stack spacing="sm">
      <Text variant="bodyMedium">Categoría</Text>

      <View style={styles.grid}>
        <Pressable
          disabled={disabled}
          onPress={() => onChange(null)}
          style={({ pressed }) => [
            styles.option,
            styles.noCategory,
            value === null && {
              borderColor: noCategoryDarkColor,
            },
            disabled && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text
            textAlign="center"
            variant="small"
            style={{
              color: noCategoryDarkColor,
            }}
          >
            Sin categoría
          </Text>
        </Pressable>

        {visibleCategories.map((category) => {
          const selected = value === category.id;
          const categoryColor = strengthenColor(category.color);

          return (
            <Pressable
              key={category.id}
              disabled={disabled}
              onPress={() => onChange(category.id)}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: category.color,
                  borderColor: selected ? categoryColor : "transparent",
                },
                disabled && styles.disabled,
                pressed && styles.pressed,
              ]}
            >
              <Text
                textAlign="center"
                variant="small"
                style={{
                  color: categoryColor,
                }}
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}

        {shouldLimitCategories && (
          <Pressable
            disabled={disabled}
            onPress={handleToggleShowAll}
            style={({ pressed }) => [
              styles.option,
              styles.moreOption,
              disabled && styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            <Text
              textAlign="center"
              variant="small"
              style={{
                color: noCategoryDarkColor,
                textDecorationLine: "underline",
              }}
            >
              {showAll ? "Ver menos..." : "Ver todas..."}
            </Text>
          </Pressable>
        )}
      </View>
    </Stack>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  option: {
    width: "31%",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },

  noCategory: {
    backgroundColor: NO_CATEGORY_COLOR,
  },

  moreOption: {
    backgroundColor: "#F1F5F9",
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },
});
