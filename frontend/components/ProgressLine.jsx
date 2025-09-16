import { View } from "react-native";


const ProgressLine = ({ progress, color = "#fff", bg = "#ffffff4c" }) => {
    return (
        <View className="w-full rounded-full h-1.5 mt-2" style={{ backgroundColor: bg }}>
            <View
                className="rounded-full h-1.5"
                style={{ width: `${progress}%`, backgroundColor: color }}
            />
        </View>
    );
};

export default ProgressLine;