# AccessibleSpeechTraining

![teaser](teaser.gif)

Accessible Speech Trainingはノートテイクを前提とした発表会や授業等において、アクセシブルな発話を支援する為のウェブアプリケーションです。

## DEMO
  * https://tetsuakibaba.jp/project/accessibleSpeech

## Benchmark集
本システムのCPM換算の妥当性を評価するためにいくつかのベンチマークをこちらに記載します。

  * [第19回情報処理学会アクセシビリティ研究会発表分](./benchmarks/aac019/README.md)
    * 坊っちゃんの最初の237文字を250,300,350,400のCPM読み上げを行い，99-98%の精度でした．

# License
本アプリケーションは以下のjsライブラリを利用しています．
  * Bootstrap, MIT Licenese, https://getbootstrap.com/
  * gauge.js, MIT License, https://bernii.github.io/gauge.js/
  * html2canvas.js, MIT License, https://html2canvas.hertzen.com/
  * p5.speech.js, MIT License, https://github.com/IDMNYU/p5.js-speech