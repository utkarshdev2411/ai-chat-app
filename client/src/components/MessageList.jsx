import React from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, loading, typingIndicator, isStoryMode = false }) => {
  // Group AI messages together
  const processedMessages = React.useMemo(() => {
    if (!messages || messages.length === 0) return [];
    
    // Filter out user messages completely
    const aiMessages = messages.filter(msg => msg.role === 'ai');
    
    // Combine sequential AI messages
    const combinedMessages = [];
    let currentMessage = null;
    
    for (const message of aiMessages) {
      if (!currentMessage) {
        currentMessage = { ...message };
        combinedMessages.push(currentMessage);
      } else {
        // Append to existing message
        currentMessage.text += "\n\n" + message.text;
        currentMessage.timestamp = message.timestamp; // Update timestamp to latest
      }
    }
    
    return combinedMessages;
  }, [messages]);

  // Realistic Fireplace Loader Component
  const FireplaceLoader = () => (
    <div className="flex items-center justify-center">
      <style jsx>{`
        .fireplace {
          width: 80px;
          height: 80px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }
        
        .fireplace__flame,
        .fireplace__flame_big {
          height: 62px;
          width: 45px;
          background: linear-gradient(0deg, rgba(236,221,66,1) 10%, rgba(237,174,52,1) 15%, rgba(237,100,52,1) 50%, rgba(250,71,8,1) 59%);
          position: relative;
          margin-bottom: -4px;
          z-index: 3;
          opacity: 0.7;
        }
        
        .fireplace__flame {
          width: 87px;
          margin-left: 2px;
          animation: burn 1.5s linear forwards infinite;
        }
        
        .fireplace__flame_big {
          margin-bottom: -1px;
          z-index: -1;
          opacity: 1;
          animation: burn_alt 2.5s linear forwards infinite;
        }
        
        .fireplace__log {
          background: linear-gradient(#e66465, #5d5e55);
          height: 25px;
          width: 5px;
          position: absolute;
          bottom: 0;
          border-radius: 2px;
          transform-origin: bottom center;
          box-shadow: 0px 0px 1px rgba(0,0,0,0.5);
        }
        
        .fireplace__log:after {
          content: "";
          display: block;
          background: #ff915b;
          width: 100%;
          height: 5px;
          border-radius: 5px;
          transform-origin: top center;
          transform: scale(1, 0.5);
        }
        
        .fireplace section:nth-of-type(1) {
          left: 17px;
          transform: rotateZ(45deg);
        }
        .fireplace section:nth-of-type(2) {
          left: 25px;
          transform: rotateZ(25deg);
        }
        .fireplace section:nth-of-type(3) {
          left: 35px;
          transform: rotateZ(5deg);
        }
        .fireplace section:nth-of-type(4) {
          left: 35px;
          transform: rotateZ(-5deg);
        }
        .fireplace section:nth-of-type(5) {
          left: 42px;
          transform: rotateZ(-15deg);
        }
        .fireplace section:nth-of-type(6) {
          left: 50px;
          transform: rotateZ(-35deg);
        }
        .fireplace section:nth-of-type(7) {
          left: 57px;
          transform: rotateZ(-45deg);
        }
        
        .fireplace__spark {
          position: absolute;
          height: 1px;
          width: 1px;
          border-radius: 1px;
          top: 0;
          left: 0;
          filter: blur(0.5px);
          background: yellow;
          z-index: 10;
          opacity: 0;
        }
        
        .fireplace main:nth-of-type(1) {
          animation: spark_1 1s forwards infinite;
        }
        .fireplace main:nth-of-type(2) {
          animation: spark_2 1s 0.75s forwards infinite;
        }
        .fireplace main:nth-of-type(3) {
          animation: spark_3 1s 0.25s forwards infinite;
        }
        .fireplace main:nth-of-type(4) {
          animation: spark_4 1s 0.5s forwards infinite;
        }
        
        .fireplace__light {
          height: 100%;
          width: 100%;
          border-radius: 50% 50% 30% 30%;
          transform: scale(1.1,1.2);
          filter: blur(12px);
          background: orange;
          position: absolute;
          top: 10px;
          left: 0;
          z-index: -1;
          opacity: 0.4;
        }
        
        .blur {
          filter: blur(0.5px);
        }
        
        .blur.fix {
          position: absolute;
        }
        
        @keyframes burn {
          0% {
            clip-path: polygon(48% 97%, 42% 97%, 37% 93%, 31% 92%, 28% 88%, 26% 81%, 29% 84%, 34% 84%, 33% 79%, 30% 74%, 31% 67%, 34% 57%, 34% 65%, 39% 71%, 43% 65%, 43% 55%, 40% 45%, 48% 59%, 49% 69%, 51% 76%, 55% 71%, 54% 65%, 54% 58%, 58% 64%, 61% 72%, 57% 92%, 61% 97%, 64% 98%, 66% 95%, 64% 93%, 57% 96%, 54% 93%, 48% 97%);
          }
          25% {
            clip-path: polygon(49% 97%, 41% 97%, 35% 92%, 33% 86%, 34% 80%, 30% 74%, 34% 77%, 38% 81%, 38% 78%, 36% 72%, 35% 67%, 37% 61%, 37% 54%, 39% 61%, 39% 67%, 43% 63%, 43% 58%, 45% 44%, 44% 58%, 48% 66%, 51% 67%, 51% 59%, 54% 67%, 56% 72%, 57% 79%, 59% 77%, 60% 71%, 61% 77%, 61% 83%, 60% 89%, 61% 94%, 57% 97%, 52% 98%);
          }
          50% {
            clip-path: polygon(46% 97%, 39% 96%, 35% 89%, 36% 84%, 34% 77%, 30% 73%, 30% 65%, 30% 70%, 35% 75%, 38% 68%, 37% 61%, 40% 53%, 41% 42%, 42% 56%, 44% 65%, 50% 67%, 51% 57%, 53% 68%, 52% 74%, 51% 81%, 55% 78%, 57% 72%, 58% 79%, 57% 85%, 55% 88%, 60% 87%, 63% 82%, 63% 89%, 59% 94%, 55% 98%, 51% 92%, 50% 99%, 45% 96%);
          }
          75% {
            clip-path: polygon(45% 97%, 38% 97%, 33% 93%, 31% 87%, 31% 81%, 29% 76%, 25% 69%, 29% 61%, 30% 69%, 35% 71%, 35% 62%, 34% 54%, 38% 45%, 38% 54%, 43% 62%, 47% 57%, 48% 49%, 44% 38%, 50% 46%, 53% 60%, 54% 71%, 53% 79%, 59% 76%, 60% 66%, 64% 73%, 63% 79%, 59% 85%, 64% 90%, 68% 84%, 68% 92%, 60% 97%, 53% 98%, 48% 99%);
          }
          100% {
            clip-path: polygon(48% 97%, 42% 97%, 37% 93%, 31% 92%, 28% 88%, 26% 81%, 29% 84%, 34% 84%, 33% 79%, 30% 74%, 31% 67%, 34% 57%, 34% 65%, 39% 71%, 43% 65%, 43% 55%, 40% 45%, 48% 59%, 49% 69%, 51% 76%, 55% 71%, 54% 65%, 54% 58%, 58% 64%, 61% 72%, 57% 92%, 61% 97%, 64% 98%, 66% 95%, 64% 93%, 57% 96%, 54% 93%, 48% 97%);
          }
        }
        
        @keyframes burn_alt {
          0%, 100% {
            clip-path: polygon(48% 97%, 43% 97%, 38% 97%, 34% 94%, 33% 91%, 32% 87%, 29% 83%, 26% 80%, 21% 75%, 20% 71%, 20% 66%, 20% 59%, 20% 65%, 24% 68%, 28% 67%, 28% 62%, 25% 60%, 21% 52%, 21% 43%, 24% 32%, 23% 39%, 24% 46%, 28% 48%, 33% 44%, 33% 39%, 31% 32%, 28% 23%, 30% 14%, 31% 22%, 35% 28%, 39% 28%, 41% 25%, 40% 21%, 39% 13%, 41% 6%, 42% 15%, 45% 23%, 49% 25%, 52% 22%, 51% 13%, 54% 21%, 56% 29%, 53% 35%, 50% 41%, 53% 46%, 58% 46%, 60% 39%, 60% 34%, 64% 39%, 65% 45%, 63% 51%, 61% 56%, 64% 61%, 68% 59%, 71% 55%, 73% 48%, 73% 40%, 76% 48%, 77% 56%, 76% 62%, 74% 66%, 69% 71%, 71% 74%, 75% 74%, 79% 71%, 81% 65%, 82% 72%, 81% 77%, 77% 82%, 73% 86%, 73% 89%, 78% 89%, 82% 85%, 81% 91%, 78% 95%, 72% 97%, 65% 98%, 59% 98%, 53% 99%, 47% 97%);
          }
          50% {
            clip-path: polygon(40% 99%, 35% 99%, 31% 98%, 25% 95%, 23% 92%, 21% 88%, 20% 83%, 21% 80%, 22% 76%, 21% 70%, 20% 68%, 18% 64%, 21% 68%, 23% 71%, 25% 75%, 26% 79%, 31% 84%, 31% 79%, 28% 69%, 23% 60%, 17% 53%, 19% 41%, 25% 31%, 24% 24%, 24% 19%, 26% 24%, 28% 30%, 26% 37%, 25% 44%, 28% 49%, 33% 50%, 39% 48%, 40% 43%, 39% 35%, 37% 29%, 42% 34%, 43% 40%, 44% 47%, 43% 53%, 45% 59%, 51% 60%, 53% 56%, 51% 49%, 51% 44%, 53% 36%, 55% 32%, 54% 22%, 57% 29%, 57% 44%, 56% 50%, 58% 56%, 62% 59%, 66% 59%, 68% 53%, 66% 45%, 65% 38%, 70% 44%, 71% 50%, 72% 55%, 71% 62%, 68% 66%, 65% 70%, 67% 74%, 72% 74%, 76% 71%, 78% 65%, 80% 68%, 81% 73%, 78% 81%, 76% 89%, 77% 93%, 75% 97%, 70% 98%, 67% 98%, 62% 98%, 58% 98%, 53% 99%, 50% 99%, 47% 99%, 45% 99%);
          }
        }
        
        @keyframes spark_1 {
          0% {
            opacity: 1;
            left: 25px;
            top: 52px;
          }
          100% {
            top: 15px;
            left: 27px;
            opacity: 0;
          }
        }
        
        @keyframes spark_2 {
          0% {
            opacity: 1;
            left: 45px;
            top: 52px;
          }
          100% {
            top: 5px;
            left: 37px;
            opacity: 0;
          }
        }
        
        @keyframes spark_3 {
          0% {
            opacity: 1;
            left: 55px;
            top: 52px;
          }
          100% {
            top: 7px;
            left: 42px;
            opacity: 0;
          }
        }
        
        @keyframes spark_4 {
          0% {
            opacity: 1;
            left: 30px;
            top: 52px;
          }
          100% {
            top: 7px;
            left: 10px;
            opacity: 0;
          }
        }
      `}</style>
      
      <div className="fireplace">
        <div className="fireplace__light"></div>
        
        {/* Logs */}
        <section className="fireplace__log"></section>
        <section className="fireplace__log"></section>
        <section className="fireplace__log"></section>
        <section className="fireplace__log"></section>
        <section className="fireplace__log"></section>
        <section className="fireplace__log"></section>
        <section className="fireplace__log"></section>
        
        {/* Flames */}
        <div className="fireplace__flame blur"></div>
        <div className="fireplace__flame_big blur fix"></div>
        
        {/* Sparks */}
        <main className="fireplace__spark"></main>
        <main className="fireplace__spark"></main>
        <main className="fireplace__spark"></main>
        <main className="fireplace__spark"></main>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-full mx-auto space-y-4 py-4">
      {processedMessages && processedMessages.length > 0 ? (
        processedMessages.map((message, index) => (
          <MessageBubble
            key={index}  // Using index since we've combined messages
            message={message}
            isStoryMode={isStoryMode}
          />
        ))
      ) : (
        <div className="text-center text-gray-500 py-8">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start a conversation to see messages appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Typing indicator with realistic fireplace loader */}
      {typingIndicator && (
        <div className="flex items-center justify-center space-x-3 py-4">
          <FireplaceLoader />
        </div>
      )}
    </div>
  );
};

export default MessageList;