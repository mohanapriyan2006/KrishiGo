import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FloatingAIButton = ({ onPress, draggable = true }) => {
  const pan = useRef(new Animated.ValueXY({
    x: screenWidth - 80,
    y: screenHeight - 200
  })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation
  useEffect(() => {
    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    startPulse();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => draggable,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        Animated.spring(scale, {
          toValue: 0.95,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        
        // Snap to edges
        const finalX = pan.x._value > screenWidth / 2 ? screenWidth - 80 : 20;
        const finalY = Math.max(100, Math.min(screenHeight - 120, pan.y._value));
        
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: finalX, y: finalY },
            useNativeDriver: false,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  const handlePressIn = () => {
    if (!draggable) {
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!draggable) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const ButtonContent = () => (
    <View className="relative">
      {/* Glow Effect Background */}
      <View className="absolute -inset-2 bg-green-300 opacity-20 rounded-full" />
      <View className="absolute -inset-1 bg-green-400 opacity-30 rounded-full" />
      
      {/* Main Button */}
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        className="w-14 h-14 bg-green-500 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
        disabled={draggable}
      >
        {/* Inner highlight */}
        <View className="absolute inset-1 bg-green-400 opacity-30 rounded-full" />
        
        <Text className="text-white font-bold text-sm">AI</Text>
        
        {/* Notification Dot */}
        <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white">
          <View className="w-full h-full bg-red-500 rounded-full" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          zIndex: 1000,
          transform: [
            { translateX: draggable ? pan.x : screenWidth - 80 },
            { translateY: draggable ? pan.y : screenHeight - 200 },
            { scale: Animated.multiply(scale, pulseAnim) },
          ],
        },
      ]}
      {...(draggable ? panResponder.panHandlers : {})}
    >
      <ButtonContent />
    </Animated.View>
  );
};

// Simple static version
const FloatingAIButtonStatic = ({ onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="absolute bottom-20 right-5 z-50">
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
        }}
      >
        <View className="relative">
          {/* Outer glow rings */}
          <View className="absolute -inset-3 bg-green-200 rounded-full opacity-20" />
          <View className="absolute -inset-2 bg-green-300 rounded-full opacity-30" />
          
          <TouchableOpacity
            onPress={onPress}
            className="w-16 h-16 bg-green-500 rounded-full items-center justify-center shadow-xl"
            activeOpacity={0.8}
          >
            {/* Inner gradient effect */}
            <View className="absolute inset-2 bg-green-400 rounded-full opacity-40" />
            <View className="absolute inset-3 bg-green-300 rounded-full opacity-20" />
            
            <Text className="text-white font-bold text-base">AI</Text>
            
            {/* Notification indicator */}
            <View className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white items-center justify-center">
              <View className="w-2 h-2 bg-white rounded-full" />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

// Minimal clean version
const FloatingAIButtonMinimal = ({ onPress }) => {
  return (
    <View className="absolute bottom-20 right-5 z-50">
      <TouchableOpacity
        onPress={onPress}
        className="w-12 h-12 bg-green-500 rounded-full items-center justify-center shadow-md"
        activeOpacity={0.7}
      >
        <Text className="text-white font-semibold text-xs">AI</Text>
      </TouchableOpacity>
    </View>
  );
};

// Usage Example
const FloatingButtonDemo = () => {
  const handleAIPress = () => {
    console.log('AI Assistant opened!');
    // Add your chat modal logic here
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Your main app content */}
      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Your App
        </Text>
        <Text className="text-base text-gray-600 text-center mb-8">
          The floating AI button will appear in the corner. 
          You can drag it around or just tap to open the assistant!
        </Text>
        
        <View className="bg-white rounded-lg p-6 shadow-sm w-full max-w-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Button Options:
          </Text>
          <Text className="text-sm text-gray-600">
            • Draggable version with snap-to-edge{'\n'}
            • Static version with pulse animation{'\n'}
            • Minimal clean version
          </Text>
        </View>
      </View>

      {/* Choose one of these floating buttons */}
      
      {/* Option 1: Draggable */}
      <FloatingAIButton
        onPress={handleAIPress}
        draggable={true}
      />
      
      {/* Option 2: Static with animations (uncomment to use) */}
      {/* <FloatingAIButtonStatic onPress={handleAIPress} /> */}
      
      {/* Option 3: Minimal (uncomment to use) */}
      {/* <FloatingAIButtonMinimal onPress={handleAIPress} /> */}
    </View>
  );
};

export default FloatingButtonDemo;
export { FloatingAIButton, FloatingAIButtonMinimal, FloatingAIButtonStatic };
