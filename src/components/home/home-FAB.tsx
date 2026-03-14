import { TrueSheet } from "@lodev09/react-native-true-sheet";
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
              icon: "school",
              label: "Škola",
              onPress: () => TrueSheet.present("addSchool"),
            },
            {
              icon: "bell",
              label: "Události",
              onPress: () => TrueSheet.present("addReminder"),
            },
            {
              icon: "check",
              label: "Úkoly",
              onPress: () => TrueSheet.present("addTask"),
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
