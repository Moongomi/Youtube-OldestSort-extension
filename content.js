/**
* ---------------------------------------------------------------------------------
* | Content Script |
* ---------------------------------------------------------------------------------
* - 유튜브 동영상을 오래된순으로 정렬하기 위해 '최신순' 정렬에서 거꾸로 정렬하는 방법을 채택
* - 따라서 현재 선택된 방식이 최신순인지 검증하기 위한 스크립트
*
* 1. 처음 로딩된 상태에서도 '최신순' 정렬로 된 유튜브 채널 동영상 목록 페이지면 동작하도록 구현
* 2. '인기순' 정렬 선택 시 역정렬 취소
* 3. 다른 탭을 선택했다가 동영상 목록 탭으로 돌아온 경우도 고려
**/

(function() {
    const isYouTubeVideosPage = () => window.location.href.startsWith("https://www.youtube.com/") && window.location.href.indexOf("/videos") !== -1;
    const sendMessageToExtension = (value) => chrome.runtime.sendMessage({ key: value });
    if (isYouTubeVideosPage()) {
      const selected = document.querySelector('.style-scope .ytd-feed-filter-chip-bar-renderer .iron-selected > #text');
      handleSelectedTitle(selected?.title,sendMessageToExtension);
      document.addEventListener("click", function(event) {
        const eventTarget = event.target.matches(".style-scope .ytd-feed-filter-chip-bar-renderer > #text");
        if (eventTarget) {
          const targetTitle = event.target.title.trim();
          handleSelectedTitle(targetTitle?.title,sendMessageToExtension);
        } else {
          if (isYouTubeVideosPage()) {
            const selectedElse = document.querySelector('.style-scope .ytd-feed-filter-chip-bar-renderer .iron-selected > #text');
            if (selectedElse) {
              handleSelectedTitle(selectedElse?.title,sendMessageToExtension);
            }
          }
        }
      });
    }
  }
)();

function handleSelectedTitle(title,func) {
  if (title === "최신순") {
    func(true);
  } else if (title === "인기순") {
    func(false);
  }
}


