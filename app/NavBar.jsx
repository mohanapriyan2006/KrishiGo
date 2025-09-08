import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

const NavBar = ({ activeTab, onTabPress }) => {
    const tabs = [
        { id: 'home', icon: 'home', label: 'Home' },
        { id: 'journey', icon: 'map', label: 'Journey' },
        { id: 'challenge', icon: 'trophy', label: 'Challenge' },
        { id: 'rewards', icon: 'gift', label: 'Rewards' },
        { id: 'profile', icon: 'person', label: 'Profile' },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <Pressable
                    android_ripple={null}
                    key={tab.id}
                    onPress={() => onTabPress(tab.id)}
                    style={styles.tab}
                >
                    <Ionicons
                        name={tab.icon}
                        size={24}
                        color={activeTab === tab.id ? '#8BC34A' : '#faf7f7'}
                    />
                </Pressable>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#8BC34A',
        paddingVertical: 12,
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default NavBar;