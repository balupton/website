---
title: Swift
date: 2017-01-11
---

Learning

- http://learnswift.tips
- http://samvlu.com/tutorials.html?ref=producthunt

Blog

- https://swift.org/blog/

API

- https://developer.apple.com/reference/swift

Language Guide

- https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/TheBasics.html#//apple_ref/doc/uid/TP40014097-CH5-ID309

Design Guidelines

- https://swift.org/documentation/api-design-guidelines/

Servers

- https://swift.org/server-apis/ 
- https://developer.ibm.com/swift/
- http://www.kitura.io
- http://perfect.org
- https://vapor.codes 
- http://www.zewo.io 
- https://github.com/necolt/Swifton

Dependencies

- https://github.com/Carthage/Carthage 

Static Site Generators

- https://docs.spelt.io 
- https://github.com/njdehoog/Spelt 
- https://spelt.io https://docs.zewo.io 

Async

- https://github.com/Zewo/Venice 
- https://github.com/duemunk/Async
- https://github.com/devxoul/Then

Databases

- https://github.com/GraphQLSwift/Graphiti 

Evolution

- https://github.com/apple/swift-evolution

Closures

- https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Closures.html 
- http://fuckingswiftblocksyntax.com 
- https://www.weheartswift.com/closures/

Extensions

- Use case: https://www.natashatherobot.com/using-swift-extensions/ 
- Naming: http://stackoverflow.com/a/26320397/130638

Features

- https://www.youtube.com/watch?v=w0Q66KdOnuo
- defer is used to ensure something runs when the context exits

Performance

- https://youtu.be/U248O0cN5iE 
- Use structs over classes (classes use heaps, structs and values use stack)
- Use structs over concatenated strings (structs offer better memory management)
- Any reference requires a heap, so values are much better as they use stack
- Strings and classes store their contents on the heap
- Enums that use strings are still better than just strings by themselves
- To use static dispatch over dynamic dispatch:
  - Use final for classes (unless they are intended to be extended)
  - Avoid using classes when structs or protocols will do
  - If a class just defines an interface for future classes, it should be a protocol
  - Class inheritance structures can probably be struct and protocol structures instead
  - Structs and classes can both use protocols, not just classes, but structs too
- Questions to always ask yourself:
  1. Is this going to be allocated to the stack or the heap
  2. When I pass this instance around, how much reference counting am I going to incur?
  3. When I call a method on this method on this instance, is it going to be statically or dynamically dispatched?
- WHAT does guard do?

Value Semantics vs Reference Semantics
- What allows certain properties within structures to be copied instead of referenced
- https://realm.io/news/swift-gallagher-value-semantics/
- https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/ClassesAndStructures.html
- https://youtu.be/U248O0cN5iE?t=6m

Realtime Collaboration

- https://realm.io

Watch

- https://www.udemy.com/apple-watch-tutorial/?couponCode=APPLE-WATCH-LIMITED

Learning

- http://swift.withthebest.com

Packages

- https://swiftpkgs.ng.bluemix.net

Animation

- https://swiftpkgs.ng.bluemix.net/package/storehouse/Advance

Example Apps

- https://github.com/Ben-G/Meet
- https://github.com/producthunt/producthunt-osx
- https://developer.apple.com/library/content/navigation/#section=Resource%20Types&topic=Sample%20Code
- https://developer.apple.com/library/content/samplecode/WatchPuzzle/Introduction/Intro.html#//apple_ref/doc/uid/TP40017284
- https://developer.apple.com/library/content/samplecode/SpeedySloth/Introduction/Intro.html#//apple_ref/doc/uid/TP40017338 
- https://developer.apple.com/library/content/samplecode/Lister/Introduction/Intro.html#//apple_ref/doc/uid/TP40014701 

Personality Analysis

- https://console.ng.bluemix.net/catalog/services/personality-insights/
- https://console.ng.bluemix.net/catalog/services/tone-analyzer/

Server Technology

- https://console.ng.bluemix.net/catalog/ 
- https://www.softlayer.com/Store/orderComputingInstance/1640,1644,2202 - $25/month

Serverless

- https://developer.ibm.com/opentech/2016/09/06/what-makes-serverless-attractive/
- https://www.ibm.com/cloud-computing/bluemix/openwhisk
