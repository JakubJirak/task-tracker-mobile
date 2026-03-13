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
          backdropColor="rgba(10, 10, 10, 0.8)"
          icon={open ? "calendar-today" : "plus"}
          fabStyle={{ backgroundColor: COLORS.accent }}
          actions={[
            {
              icon: "table",
              label: "Škola",
              onPress: () => console.log("Pressed star"),
            },
            {
              icon: "bell",
              label: "Události",
              onPress: () => console.log("Pressed email"),
            },
            {
              icon: "check",
              label: "Úkoly",
              onPress: () => console.log("Pressed notifications"),
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
