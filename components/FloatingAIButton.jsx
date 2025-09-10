import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


const FloatingAIButton = ({ isActive = false, setIsActive }) => {

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const ringAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Draggable position
  const { width, height } = Dimensions.get('window');
  const pan = useRef(new Animated.ValueXY({ x: width - 80, y: height - 160 })).current;

  // track whether user moved finger enough to be considered a drag
  const moved = useRef(false);

  // PanResponder for dragging — only become responder when movement exceeds threshold
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false, // don't steal taps
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        Math.abs(gestureState.dx) > 6 || Math.abs(gestureState.dy) > 6,
      onPanResponderGrant: () => {
        moved.current = false;
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 6 || Math.abs(gestureState.dy) > 6) {
          moved.current = true;
        }
        Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(evt, gestureState);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        // treat as tap if there was no meaningful movement
        if (!moved.current) {
          handlePress && handlePress();
          return;
        }
        // optional: snap inside bounds after release
        const minX = 8;
        const maxX = width - 72;
        const minY = 8;
        const maxY = height - 120;
        const clampedX = Math.min(Math.max(pan.x._value, minX), maxX);
        const clampedY = Math.min(Math.max(pan.y._value, minY), maxY);
        Animated.spring(pan, { toValue: { x: clampedX, y: clampedY }, useNativeDriver: false }).start();
      },
    })
  ).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    );
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
    );
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
      ])
    );
    const ringAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(ringAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.05, duration: 3000, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
      ])
    );

    pulseAnimation.start(); rotateAnimation.start(); glowAnimation.start();
    ringAnimation.start(); bounceAnimation.start();

    return () => {
      pulseAnimation.stop(); rotateAnimation.stop(); glowAnimation.stop();
      ringAnimation.stop(); bounceAnimation.stop();
    };
  }, [pulseAnim, rotateAnim, glowAnim, ringAnim, bounceAnim]);

  const handlePress = () => {
    setIsActive && setIsActive(!isActive);
    console.log('Floating AI Button Pressed');
  };


  const rotateInterpolate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          position: 'absolute',
          zIndex: 50,
          left: pan.x,
          top: pan.y,
        },
      ]}
    >

      <Animated.View
        style={{
          position: 'absolute', width: 80, height: 80, borderRadius: 40,
          backgroundColor: 'rgba(55, 216, 0, 0.4)', transform: [{ scale: pulseAnim }], opacity: 0.5,
        }}
        className="absolute -top-2 -left-2 blur-md"
      />
      <Animated.View
        style={{
          position: 'absolute', width: 72, height: 72, borderRadius: 36, borderWidth: 1,
          borderColor: 'rgba(34, 197, 94, 0.2)', transform: [{ rotate: rotateInterpolate }],
        }}
        className="absolute -top-2 -left-2"
      />

      <View className="relative">
        <Animated.View
          style={{
            position: 'absolute', width: 64, height: 64, borderRadius: 32, borderWidth: 2,
            borderColor: 'rgba(34, 197, 94, 0.4)', transform: [{ scale: ringAnim }], opacity: 0.7,
          }}
        />

        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.85}
          // keep TouchableOpacity focused only for taps; PanResponder won't intercept quick taps
          style={{
            transform: [{ scale: scaleAnim }, { scale: bounceAnim }],
          }}
          className={`w-16 h-16 bg-slate-900 border-2 rounded-full items-center justify-center ${isActive ? 'border-lime-400' : 'border-lime-500/60'}`}
        >
          <View
            className="absolute inset-1 rounded-full"
            style={{ backgroundColor: isActive ? 'rgba(55, 216, 0, 0.3)' : 'rgba(55, 216, 0, 0.2)' }}
          />
          <Text className="text-lime-300 font-bold text-xl relative z-10">
            {isActive ? 'X' : 'AI'}
          </Text>

        </TouchableOpacity>
      </View>

    </Animated.View>
  );
};

export default FloatingAIButton;