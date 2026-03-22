module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 型の種類を制限
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新機能
        'fix',      // バグ修正
        'docs',     // ドキュメント
        'style',    // フォーマット（コードの意味変更なし）
        'refactor', // リファクタリング
        'perf',     // パフォーマンス改善
        'test',     // テスト追加・修正
        'build',    // ビルドシステム・外部依存
        'ci',       // CI 設定
        'chore',    // その他の変更
        'revert',   // リバート
      ],
    ],
    // subject は空にしない
    'subject-empty': [2, 'never'],
    // type は空にしない
    'type-empty': [2, 'never'],
    // subject の最大長
    'subject-max-length': [1, 'always', 100],
  },
};
