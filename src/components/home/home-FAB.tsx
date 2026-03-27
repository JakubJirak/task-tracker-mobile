import { openAddReminderSheet } from "@/components/home/reminders/addReminderSheet";
import { openAddSchoolSheet } from "@/components/home/school/addSchoolSheet";
import { openAddTaskSheet } from "@/components/home/tasks/addTaskSheet";
import * as React from "react";
import { FAB, PaperProvider, Portal } from "react-native-paper";
import { COLORS } from "../../constants/COLORS";

const HomeFAB = () => {
  const [state, setState] = React.useState<{ open: boolean }>({ open: false });

  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  const { open } = state;

  return (
    <PaperProvider>
      <Portal>
        <FAB.Group
          open={open}
          visible
          backdropColor="rgba(10, 10, 10, 0.4)"
          icon={open ? "calendar-today" : "plus"}
          fabStyle={{ backgroundColor: COLORS.accent }}
          actions={[
            {
              icon: "check",
              label: "Úkoly",
              onPress: () =>
                openAddTaskSheet({
                  redirectOnSuccessTo: "/(auth)/(tabs)/home/tasks",
                }),
            },
            {
              icon: "bell",
              label: "Události",
              onPress: () =>
                openAddReminderSheet({
                  redirectOnSuccessTo: "/(auth)/(tabs)/home/reminders",
                }),
            },
            {
              icon: "school",
              label: "Škola",
              onPress: () =>
                openAddSchoolSheet({
                  redirectOnSuccessTo: "/(auth)/(tabs)/home/school",
                }),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </PaperProvider>
  );
};

export default HomeFAB;
